import React, { useMemo } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { LuPiggyBank, LuTrendingDown, LuTarget, LuZap, LuLightbulb } from 'react-icons/lu';
import { useFinancial } from '../../context/FinancialContext';

const FinancialHealth = () => {
  const { incomes, expenses, loading } = useFinancial();

  // Calculate monthly financial metrics
  const monthlyMetrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter current month data
    const monthlyIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    });

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate metrics
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const budgetOvershoot = totalExpenses > totalIncome ? ((totalExpenses - totalIncome) / totalIncome) * 100 : 0;

    // Emergency spending (assuming expenses > 80% of income are emergency)
    const emergencyThreshold = totalIncome * 0.8;
    const emergencySpending = totalExpenses > emergencyThreshold ? ((totalExpenses - emergencyThreshold) / totalIncome) * 100 : 0;

    // Calculate score (0-100)
    let score = 100;

    // Savings rate impact (ideal: 20%+)
    if (savingsRate < 10) score -= 30;
    else if (savingsRate < 20) score -= 15;

    // Expense ratio impact (ideal: <70%)
    if (expenseRatio > 90) score -= 25;
    else if (expenseRatio > 80) score -= 15;
    else if (expenseRatio > 70) score -= 5;

    // Budget overshoot penalty
    score -= budgetOvershoot * 0.5;

    // Emergency spending penalty
    score -= emergencySpending * 0.3;

    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score,
      totalIncome,
      totalExpenses,
      savingsRate: Math.round(savingsRate),
      expenseRatio: Math.round(expenseRatio),
      budgetOvershoot: Math.round(budgetOvershoot),
      emergencySpending: Math.round(emergencySpending),
    };
  }, [incomes, expenses]);

  const { score, savingsRate, expenseRatio, budgetOvershoot, emergencySpending } = monthlyMetrics;

  const scoreColor = score < 40 ? 'text-red-500' : score <= 70 ? 'text-yellow-500' : 'text-green-500';
  const scoreBg = score < 40 ? 'bg-red-100' : score <= 70 ? 'bg-yellow-100' : 'bg-green-100';

  const breakdownCards = [
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      explanation: 'Percentage of income saved monthly',
      icon: LuPiggyBank,
      color: 'bg-blue-500',
    },
    {
      title: 'Expense vs Income Ratio',
      value: `${expenseRatio}%`,
      explanation: 'Expenses as a percentage of income',
      icon: LuTrendingDown,
      color: 'bg-orange-500',
    },
    {
      title: 'Budget Overshoot',
      value: `${budgetOvershoot}%`,
      explanation: 'Amount over budgeted expenses',
      icon: LuTarget,
      color: 'bg-purple-500',
    },
    {
      title: 'Emergency Spending',
      value: `${emergencySpending}%`,
      explanation: 'Unexpected expenses this month',
      icon: LuZap,
      color: 'bg-red-500',
    },
  ];

  const getInsights = () => {
    const insights = [];
    if (savingsRate < 15) {
      insights.push('Increasing savings rate can significantly improve your score.');
    }
    if (expenseRatio > 80) {
      insights.push('Your expenses are high relative to income. Consider budgeting.');
    }
    if (budgetOvershoot > 0) {
      insights.push('You\'re spending more than you earn. Review your budget.');
    }
    if (emergencySpending > 10) {
      insights.push('High emergency spending detected. Build an emergency fund.');
    }
    if (insights.length === 0) {
      insights.push('Great job! Your financial health is in good shape.');
      insights.push('Continue maintaining your savings rate and budget.');
    }
    return insights;
  };

  const insights = getInsights();

  return (
    <DashboardLayout activeMenu="Finance Score">
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Monthly Financial Health Score
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your financial wellness at a glance
          </p>
        </div>

        {/* Main Score Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center">
          <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full ${scoreBg} flex items-center justify-center mb-4`}>
            <div className="text-center">
              <div className={`text-3xl sm:text-4xl font-bold ${scoreColor}`}>{score}</div>
              <div className="text-sm text-gray-600">/100</div>
            </div>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
            Your financial health score is {score}/100
          </p>
        </div>

        {/* Score Breakdown Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Score Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {breakdownCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${card.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{card.title}</h3>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{card.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{card.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <LuLightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Insights & Tips</h2>
          </div>
          <div className="space-y-3">
            {insights.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialHealth;
