const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

// @route   GET api/transactions
// @desc    Get all transactions for the current user
// @access  Private
router.get('/', authMiddleware, transactionController.getUserTransactions);

module.exports = router;
