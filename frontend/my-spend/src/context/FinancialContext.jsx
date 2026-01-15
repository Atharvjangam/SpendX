import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from './UserContext';

export const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

const FinancialProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  // Fetch incomes
  const fetchIncomes = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomes(response.data || []);
    } catch (error) {
      setError('Failed to fetch incomes');
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      const expenseArray = response.data?.expenses || response.data?.data || response.data || [];
      setExpenses(Array.isArray(expenseArray) ? expenseArray : []);
    } catch (error) {
      setError('Failed to fetch expenses');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add income
  const addIncome = async (incomeData) => {
    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, incomeData);
      setIncomes(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Add expense
  const addExpense = async (expenseData) => {
    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, expenseData);
      setExpenses(prev => [response.data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Delete income
  const deleteIncome = async (incomeId) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      setIncomes(prev => prev.filter(income => income._id !== incomeId));
    } catch (error) {
      throw error;
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      setExpenses(prev => prev.filter(expense => expense._id !== expenseId));
    } catch (error) {
      throw error;
    }
  };

  // Fetch data on user login
  useEffect(() => {
    if (user) {
      fetchIncomes();
      fetchExpenses();
    } else {
      setIncomes([]);
      setExpenses([]);
    }
  }, [user]);

  const value = {
    incomes,
    expenses,
    loading,
    error,
    fetchIncomes,
    fetchExpenses,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

export default FinancialProvider;
