import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AddExpense from '../../components/AddExpense';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { LuTrendingDown, LuDownload, LuPlus, LuTrash2, LuShoppingCart, LuCar, LuBuilding, LuUtensils, LuGamepad2, LuHeart, LuBriefcase, LuBookOpen, LuZap } from 'react-icons/lu';
import moment from 'moment';
import { useFinancial } from '../../context/FinancialContext';

const Expense = () => {
  const { expenses, loading, error, addExpense, deleteExpense } = useFinancial();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Download expense Excel
  const downloadExpenseExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  // Handle add expense success
  const handleAddExpenseSuccess = async (expenseData) => {
    try {
      await addExpense(expenseData);
      setShowAddExpenseModal(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      // Optionally show an error message to the user
      alert('Failed to add expense. Please try again.');
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Grocery': LuUtensils,
      'Transport': LuCar,
      'Shopping': LuShoppingCart,
      'Health': LuHeart,
      'Bills': LuZap,
      'Education': LuBookOpen,
      'Work': LuBriefcase,
      'Home': LuBuilding,
    };
    const IconComponent = iconMap[category] || LuShoppingCart;
    return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
  };

  // Prepare chart data from expenses
  const chartData = expenses.reduce((acc, expense) => {
    const date = moment(expense.date).format('Do MMM');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += expense.amount;
      existing.details.push({ category: expense.category, amount: expense.amount });
    } else {
      acc.push({
        date,
        amount: expense.amount,
        fullDate: moment(expense.date),
        details: [{ category: expense.category, amount: expense.amount }]
      });
    }
    return acc;
  }, []).sort((a, b) => a.fullDate - b.fullDate);

  // Custom tooltip for chart

  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
          <p className="font-semibold text-purple-600">{`Total: ₹${data.amount.toLocaleString()}`}</p>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Breakdown:</p>
            {data.details.map((detail, index) => (
              <p key={index} className="text-sm text-gray-700">
                {detail.category}: ₹{detail.amount.toLocaleString()}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        {/* Expense Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Expense Overview</h1>
              <p className="text-gray-600 mt-1">Track your spending over time and analyze your expense trends.</p>
            </div>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-5 h-5" />
              Add Expense
            </button>
          </div>

          {/* Line Chart */}
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="30%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e0e0e0" horizontal={true} vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  domain={[0, 'dataMax']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#expenseGradient)"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Expenses Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">All Expenses</h2>
            <button
              onClick={downloadExpenseExcel}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base flex items-center gap-1"
            >
              <LuDownload className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading expenses...</p>
            </div>
          )}

          {/* Expense List */}
          {!loading && expenses.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses found. Add your first expense!</p>
            </div>
          )}

          {!loading && expenses.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{expense.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {moment(expense.date).format('MMM DD, YYYY')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center text-red-600">
                      <LuTrendingDown className="w-4 h-4 mr-1" />
                      <p className="font-semibold text-sm sm:text-base">
                        -₹{expense.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteExpense(expense._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete expense"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        {showAddExpenseModal && (
          <AddExpense
            onClose={() => setShowAddExpenseModal(false)}
            onSuccess={handleAddExpenseSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Expense;
