import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { LuWallet, LuTrendingUp, LuTrendingDown, LuShoppingBag, LuPlane, LuZap, LuCreditCard, LuPiggyBank, LuTarget, LuCalendar } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';

// Icon mapping for transactions
const iconMap = {
  'LuShoppingBag': LuShoppingBag,
  'LuPlane': LuPlane,
  'LuZap': LuZap,
  'LuCreditCard': LuCreditCard,
  'LuPiggyBank': LuPiggyBank,
  'LuTarget': LuTarget,
  'LuCalendar': LuCalendar,
  'LuTrendingUp': LuTrendingUp,
  'LuUtensilsCrossed': LuShoppingBag, // fallback
  'LuGamepad2': LuShoppingBag, // fallback
  'LuHeart': LuShoppingBag, // fallback
  'LuGraduationCap': LuShoppingBag, // fallback
  'LuCar': LuShoppingBag, // fallback
  'LuReceipt': LuShoppingBag, // fallback
  'LuMoreHorizontal': LuShoppingBag, // fallback
};

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    recentTransactions: [],
    recentExpenses: [],
    incomeBreakdown: [],
    expenseDataLast30Days: [],
    incomeTrendLast60Days: [],
    latestIncomeTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Summary cards data
  const summaryCards = [
    
    {
      title: "Total Income",
      amount: `₹${dashboardData.totalIncome.toLocaleString()}`,
      icon: LuTrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Total Expenses",
      amount: `₹${dashboardData.totalExpenses.toLocaleString()}`,
      icon: LuTrendingDown,
      color: "bg-red-500",
    },
    {
      title: "Total Balance",
      amount: `₹${dashboardData.totalBalance.toLocaleString()}`,
      icon: LuWallet,
      color: "bg-purple-500",
    },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Total Balance', value: dashboardData.totalBalance, color: '#8b5cf6' },
    { name: 'Total Expenses', value: dashboardData.totalExpenses, color: '#ef4444' },
    { name: 'Total Income', value: dashboardData.totalIncome, color: '#22C55E' },
  ];

  // Recent transactions with dynamic icons
  const recentTransactions = dashboardData.recentTransactions.map(transaction => ({
    ...transaction,
    icon: iconMap[transaction.icon] || LuShoppingBag
  }));

  // Recent expenses with dynamic icons
  const recentExpenses = dashboardData.recentExpenses.map(expense => ({
    ...expense,
    icon: iconMap[expense.icon] || LuShoppingBag
  }));

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        {/* Top Section - Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${card.color} flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}>
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-xs sm:text-sm truncate">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{card.amount}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Left Card: Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base self-start sm:self-auto">
                See All →
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <transaction.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{transaction.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm sm:text-base flex-shrink-0 ml-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Financial Overview */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Financial Overview</h2>
            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 mb-6 sm:mb-8 shadow-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="expensesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#78C841" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#78C841" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1200}
                    >
                      {pieData.map((entry, index) => {
                        const gradientId = entry.name === 'Total Balance' ? 'balanceGradient' :
                                           entry.name === 'Total Expenses' ? 'expensesGradient' : 'incomeGradient';
                        return <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />;
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-semibold text-gray-700">Total Balance</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">₹{dashboardData.totalBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 mr-1 sm:mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Total Balance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Total Expenses</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Total Income</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Two Column Layout - Income Breakdown & Expense Bar Graph */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left Card: Recent Expenses */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Expenses</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base self-start sm:self-auto">
                See All →
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <expense.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{expense.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{expense.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm sm:text-base flex-shrink-0 ml-2 text-red-600">
                    ₹{expense.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Last 30 Days Expense Bar Graph */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Expenses - Last 30 Days</h2>
            <div className="h-64 sm:h-80">
              {dashboardData.expenseDataLast30Days && dashboardData.expenseDataLast30Days.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.expenseDataLast30Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E9D5FF" stopOpacity={1} />
                        <stop offset="100%" stopColor="#7E22CE" stopOpacity={0.85} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return !isNaN(date) ? moment(date).format('MM/DD') : value;
                      }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return !isNaN(date) ? moment(date).format('MMM DD, YYYY') : value;
                      }}
                      contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#f9fafb' }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <LuTrendingDown className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No expenses in the last 30 days</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Two Column Layout - Income Trend & Latest Income Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Card: 60 Days Income Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Income Growth – Last 60 Days</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.incomeTrendLast60Days}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#7E22CE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7E22CE" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#22C55E' }}
                    tickFormatter={(value) => moment(value).format('MM/DD')}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Income']}
                    labelFormatter={(value) => moment(value).format('MMM DD, YYYY')}
                    contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#f9fafb' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#7E22CE"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Card: Latest Income Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Latest Income Transactions</h2>
            <div className="space-y-3 sm:space-y-4 max-h-64 overflow-y-auto">
              {dashboardData.latestIncomeTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <LuTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{transaction.source}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{moment(transaction.date).format('MMM DD, YYYY')}</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      Credited
                    </span>
                    <LuTrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <p className="font-semibold text-sm sm:text-base text-green-600">₹{transaction.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
