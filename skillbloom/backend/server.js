require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, initDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'AI Career Guidance System Backend ✅ (MySQL)' });
});

// API Routes
app.use('/api/register', authRoutes);
app.use('/api/login', authRoutes);
app.use('/api/profile', authMiddleware, authRoutes);

// Connect DB & Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test MySQL connection
    await connectDB();
    
    // Initialize database tables
    await initDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

