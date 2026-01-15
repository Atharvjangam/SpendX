import React, { useState, useEffect } from 'react';
import Input from './Inputs/Input';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const AddBank = ({ onClose, onSuccess, editingBank }) => {
  // Form state
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [openingBalance, setOpeningBalance] = useState('');

  // UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (editingBank) {
      setBankName(editingBank.bankName || '');
      setAccountHolderName(editingBank.accountHolderName || '');
      setAccountNumber(editingBank.accountNumber || '');
      setIfscCode(editingBank.ifscCode || '');
      setAccountType(editingBank.accountType || 'Savings');
      setOpeningBalance(editingBank.openingBalance?.toString() || '');
    }
  }, [editingBank]);

  // Form validation
  const validateForm = () => {
    if (!bankName.trim()) {
      setError('Please enter bank name');
      return false;
    }
    if (!accountHolderName.trim()) {
      setError('Please enter account holder name');
      return false;
    }
    if (!accountNumber.trim()) {
      setError('Please enter account number');
      return false;
    }
    if (!ifscCode.trim()) {
      setError('Please enter IFSC code');
      return false;
    }
    if (!openingBalance || isNaN(openingBalance) || parseFloat(openingBalance) < 0) {
      setError('Please enter a valid opening balance');
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
      const bankData = {
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountType,
        openingBalance: parseFloat(openingBalance),
      };

      if (editingBank) {
        // Update existing bank
        await axiosInstance.put(API_PATHS.BANK.UPDATE_BANK(editingBank._id), bankData);
      } else {
        // Add new bank
        await axiosInstance.post(API_PATHS.BANK.ADD_BANK, bankData);
      }

      // Success: reset form, close modal, notify parent
      setBankName('');
      setAccountHolderName('');
      setAccountNumber('');
      setIfscCode('');
      setAccountType('Savings');
      setOpeningBalance('');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Bank Name */}
          <div className="mb-4">
            <Input
              label="Bank Name"
              placeholder="e.g., State Bank of India"
              type="text"
              value={bankName}
              onChange={({ target }) => setBankName(target.value)}
            />
          </div>

          {/* Account Holder Name */}
          <div className="mb-4">
            <Input
              label="Account Holder Name"
              placeholder="e.g., John Doe"
              type="text"
              value={accountHolderName}
              onChange={({ target }) => setAccountHolderName(target.value)}
            />
          </div>

          {/* Account Number */}
          <div className="mb-4">
            <Input
              label="Account Number"
              placeholder="e.g., 123456789012"
              type="text"
              value={accountNumber}
              onChange={({ target }) => setAccountNumber(target.value)}
            />
          </div>

          {/* IFSC Code */}
          <div className="mb-4">
            <Input
              label="IFSC Code"
              placeholder="e.g., SBIN0001234"
              type="text"
              value={ifscCode}
              onChange={({ target }) => setIfscCode(target.value)}
            />
          </div>

          {/* Account Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {/* Opening Balance */}
          <div className="mb-6">
            <Input
              label="Opening Balance"
              placeholder="e.g., 10000"
              type="number"
              value={openingBalance}
              onChange={({ target }) => setOpeningBalance(target.value)}
            />
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
            {loading ? (editingBank ? 'Updating...' : 'Adding...') : (editingBank ? 'Update Bank Account' : 'Add Bank Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBank;
