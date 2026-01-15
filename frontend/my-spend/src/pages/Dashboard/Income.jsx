import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AddIncome from '../../components/AddIncome';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LuTrendingUp, LuDownload, LuPlus, LuTrendingDown, LuTrash2 } from 'react-icons/lu';
import moment from 'moment';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);

  // Fetch incomes
  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomes(response.data);
    } catch (error) {
      setError('Failed to fetch incomes. Please try again.');
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete income
  const deleteIncome = async (incomeId) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      setIncomes(incomes.filter(income => income._id !== incomeId));
    } catch (error) {
      setError('Failed to delete income. Please try again.');
      console.error('Error deleting income:', error);
    }
  };

  // Download income Excel
  const downloadIncomeExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download Excel file. Please try again.');
      console.error('Error downloading Excel:', error);
    }
  };

  // Handle add income success
  const handleAddIncomeSuccess = (newIncome) => {
    setIncomes([newIncome, ...incomes]);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Calculate total income
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  // Prepare chart data from incomes
  const chartData = incomes.reduce((acc, income) => {
    const date = moment(income.date).format('Do MMM');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += income.amount;
    } else {
      acc.push({ date, amount: income.amount, fullDate: moment(income.date) });
    }
    return acc;
  }, []).sort((a, b) => a.fullDate - b.fullDate);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        {/* Income Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Income Overview</h1>
              <p className="text-gray-600 mt-1">Track your earnings over time and analyze your income trends.</p>
            </div>
            <button
              onClick={() => setShowAddIncomeModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-5 h-5" />
              Add Income
            </button>
          </div>

          {/* Bar Chart */}
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5  }}>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                  formatter={(value, name) => [`₹${value}`, 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar
                  dataKey="amount"
                  radius={[14, 14, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#e9d5ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Sources Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Income Sources</h2>
            <button
              onClick={downloadIncomeExcel}
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
              <p className="text-gray-600 mt-2">Loading incomes...</p>
            </div>
          )}

          {/* Income List */}
          {!loading && incomes.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No income sources found. Add your first income!</p>
            </div>
          )}

          {!loading && incomes.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {incomes.map((income) => (
                <div key={income._id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <LuTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{income.source}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {moment(income.date).format('MMM DD, YYYY')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center text-green-600">
                      <LuTrendingUp className="w-4 h-4 mr-1" />
                      <p className="font-semibold text-sm sm:text-base">
                        +₹{income.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteIncome(income._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete income"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Income Modal */}
        {showAddIncomeModal && (
          <AddIncome
            onClose={() => setShowAddIncomeModal(false)}
            onSuccess={handleAddIncomeSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Income;
