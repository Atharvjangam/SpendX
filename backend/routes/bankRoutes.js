const express = require('express');
const { addBank, getAllBanks, updateBank, deleteBank } = require('../controllers/bankController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addBank);
router.get('/', authMiddleware, getAllBanks);
router.put('/:id', authMiddleware, updateBank);
router.delete('/:id', authMiddleware, deleteBank);

module.exports = router;
