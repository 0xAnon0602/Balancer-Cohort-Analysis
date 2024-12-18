const express = require('express');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactionRoutes');
const connectDB = require('./config/db');
const fetchTransactions = require('./fetchTransactions')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

fetchTransactions()
