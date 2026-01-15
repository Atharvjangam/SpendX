const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { title, amount, date, category } = req.body;

    // Validation
    if (!title || !amount || !date || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      title,
      amount,
      date: new Date(date),
      category,
    });

    await newExpense.save();
    res.status(200).json(newExpense);

  } catch (error) {
    console.error(error); // 👈 IMPORTANT for debugging
    res.status(500).json({ message: "Server Error.." });
  }
};

// Get All Expenses
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json(expenses);

  } catch (error) {
    console.error(error); // 👈 IMPORTANT for debugging
    res.status(500).json({ message: "Server Error.." });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully.." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel..
    const data = expenses.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Date: item.date,
      Category: item.category,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    xlsx.writeFile(wb, 'expense_details.xlsx');
    res.download('expense_details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
