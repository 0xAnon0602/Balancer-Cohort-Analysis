const Transaction = require('../models/transaction');

const saveTransaction = async (transactionData) => {
    try {
        const transaction = new Transaction(transactionData);
        await transaction.save();
    } catch (error) {
        console.error('Error saving transaction:', error.message);
    }
};

const getOneTransaction = async () => {
    try {
        const transaction = await Transaction.findOne().sort({ timestamp: 1 });
        return transaction;
    } catch (error) {
        console.error('Error getting transaction:', error.message);
    }
};

module.exports = { saveTransaction,getOneTransaction };