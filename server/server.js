require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dns = require('dns');
const connectDB = require('./config/db');
const analysisRoutes = require('./routes/analysisRoutes');

// Fix DNS: force IPv4 first (prevents dual-stack/IPv6 connectivity issues)
dns.setDefaultResultOrder('ipv4first');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/analysis', analysisRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TruthLens API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`TruthLens Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
