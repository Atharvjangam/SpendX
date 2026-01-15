import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AddBank from '../../components/AddBank';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuBuilding2, LuPlus, LuTrash2, LuPencil } from 'react-icons/lu';

const Bank = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  // Fetch banks
  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.BANK.GET_ALL_BANK);
      setBanks(response.data);
    } catch (error) {
      setError('Failed to fetch banks. Please try again.');
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete bank
  const deleteBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return;

    try {
      await axiosInstance.delete(API_PATHS.BANK.DELETE_BANK(bankId));
      setBanks(banks.filter(bank => bank._id !== bankId));
    } catch (error) {
      setError('Failed to delete bank account. Please try again.');
      console.error('Error deleting bank:', error);
    }
  };

  // Handle add/edit bank success
  const handleBankSuccess = (newBank) => {
    if (editingBank) {
      setBanks(banks.map(bank => bank._id === newBank._id ? newBank : bank));
    } else {
      setBanks([newBank, ...banks]);
    }
    setEditingBank(null);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <DashboardLayout activeMenu="Bank">
      <div>Bank Page Loaded</div>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        {/* Bank Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Bank Accounts</h1>
              <p className="text-gray-600 mt-1">Manage your bank accounts and track your financial details.</p>
            </div>
            <button
              onClick={() => setShowAddBankModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-5 h-5" />
              Add Bank Account
            </button>
          </div>
        </div>

        {/* Bank List Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Your Bank Accounts</h2>

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
              <p className="text-gray-600 mt-2">Loading bank accounts...</p>
            </div>
          )}

          {/* Bank List */}
          {!loading && banks.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bank accounts found. Add your first bank account!</p>
            </div>
          )}

          {!loading && banks.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {banks.map((bank) => (
                <div key={bank._id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <LuBuilding2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{bank.bankName}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {bank.accountHolderName} • {bank.accountType} • {bank.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-gray-800">
                        ₹{bank.openingBalance?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500">Opening Balance</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBank(bank);
                        setShowAddBankModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit bank"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBank(bank._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete bank"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Bank Modal */}
        {showAddBankModal && (
          <AddBank
            onClose={() => {
              setShowAddBankModal(false);
              setEditingBank(null);
            }}
            onSuccess={handleBankSuccess}
            editingBank={editingBank}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bank;
