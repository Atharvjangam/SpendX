const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Calculate total income
    const totalIncomeResult = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    // Calculate total expenses
    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpenses = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    // Calculate total balance
    const totalBalance = totalIncome - totalExpenses;

    // Get recent transactions (last 5 expenses and incomes combined)
    const recentExpensesRaw = await Expense.find({ userId }).sort({ date: -1 }).limit(5).select('title amount date category');
    const recentIncomes = await Income.find({ userId }).sort({ date: -1 }).limit(5).select('source amount date icon');

    // Prepare recent expenses for separate use
    const recentExpenses = recentExpensesRaw.map(exp => ({
      name: exp.title,
      date: exp.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      amount: exp.amount,
      icon: getIconForCategory(exp.category),
      type: "expense"
    }));

    // Combine and sort by date
    const recentTransactions = [
      ...recentExpensesRaw.map(exp => ({
        name: exp.title,
        date: exp.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        amount: -exp.amount, // Negative for expenses
        icon: getIconForCategory(exp.category),
        type: "expense"
      })),
      ...recentIncomes.map(inc => ({
        name: inc.source,
        date: inc.date.toISOString().split('T')[0],
        amount: inc.amount,
        icon: inc.icon || "LuTrendingUp",
        type: "income"
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Income breakdown by source
    const incomeBreakdownResult = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$source", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);
    const incomeBreakdown = incomeBreakdownResult.map(item => ({
      category: item._id,
      amount: item.total
    }));

    // Last 30 days expenses data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysExpenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    const expenseDataLast30Days = last30DaysExpenses.map(item => ({
      date: item._id,
      amount: item.total
    }));

    // Last 60 days income trend data
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const last60DaysIncome = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: sixtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    const incomeTrendLast60Days = last60DaysIncome.map(item => ({
      date: item._id,
      amount: item.total
    }));

    // Latest income transactions (last 5)
    const latestIncomeTransactions = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .select('source amount date');

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpenses,
      recentTransactions,
      recentExpenses,
      incomeBreakdown,
      expenseDataLast30Days,
      incomeTrendLast60Days,
      latestIncomeTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error.." });
  }
};

// Helper function to get icon based on category
function getIconForCategory(category) {
  const iconMap = {
    "Shopping": "LuShoppingBag",
    "Travel": "LuPlane",
    "Electricity": "LuZap",
    "Food": "LuUtensilsCrossed",
    "Entertainment": "LuGamepad2",
    "Health": "LuHeart",
    "Education": "LuGraduationCap",
    "Transportation": "LuCar",
    "Bills": "LuReceipt",
    "Other": "LuMoreHorizontal"
  };
  return iconMap[category] || "LuShoppingBag";
}
