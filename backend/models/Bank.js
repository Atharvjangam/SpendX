const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Savings', 'Current'],
  },
  openingBalance: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bank', bankSchema);
