import React, { useState } from 'react';
import Input from './Inputs/Input';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { EXPENSE_CATEGORIES } from '../utils/data';

const AddExpense = ({ onClose, onSuccess }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  // UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return false;
    }
    if (!date) {
      setError('Please select a date');
      return false;
    }
    if (!category) {
      setError('Please select a category');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const expenseData = {
        title: title.trim(),
        amount: parseFloat(amount),
        date,
        category: category.trim(),
      };

      // Success: reset form, close modal, notify parent
      setTitle('');
      setAmount('');
      setDate('');
      setCategory('');
      onSuccess && onSuccess(expenseData);
      onClose();
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Input */}
          <div className="mb-4">
            <Input
              label="Title"
              placeholder="e.g., Grocery Shopping"
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <Input
              label="Amount"
              placeholder="e.g., 500"
              type="number"
              value={amount}
              onChange={({ target }) => setAmount(target.value)}
            />
          </div>

          {/* Date Input */}
          <div className="mb-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </div>

          {/* Category Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
