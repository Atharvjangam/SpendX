const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses, deleteExpense, downloadExpenseExcel } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addExpense);
router.get('/', authMiddleware, getAllExpenses);
router.delete('/:id', authMiddleware, deleteExpense);
router.get('/download', authMiddleware, downloadExpenseExcel);

module.exports = router;


// routes/expense.js
router.get("/expense", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});
