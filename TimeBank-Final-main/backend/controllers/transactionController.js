const Transaction = require('../models/Transaction');

// Get all transactions for the current user
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ fromUser: req.user.id }, { toUser: req.user.id }],
        })
            .populate('fromUser', 'name')
            .populate('toUser', 'name')
            .populate({
                path: 'job',
                select: 'service',
                populate: {
                    path: 'service',
                    select: 'title'
                }
            })
            .sort({ timestamp: -1 });

        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
