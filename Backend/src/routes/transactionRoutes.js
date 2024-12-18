const express = require('express');
const { saveTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.post('/saveTransaction', async (req, res) => {
    try {
        await saveTransaction(req.body);
        res.status(201).send('Transaction saved');
    } catch (error) {
        console.log(error)
        res.status(500).send('Error saving transaction');
    }
});

module.exports = router;