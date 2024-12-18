const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: String,
    chain: String,
    valueUSD: Number,
    timestamp: Date,
    poolId: String,
    tx: String,
    userAddress: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;