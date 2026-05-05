require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB, initDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const profilesRoutes = require('./routes/profiles');
const uploadRoutes = require('./routes/upload');
const applicationsRoutes = require('./routes/applications');
const connectionsRoutes = require('./routes/connections');

const app = express();
const frontendDir = path.join(__dirname, '..', 'frontend');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ message: 'SkillBloom backend ready', status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/connections', connectionsRoutes);

// Static frontend
app.use(express.static(frontendDir));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Connect DB & Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Test MySQL connection and initialize tables when the database is available.
  // The static frontend still starts if local MySQL is not running.
  try {
    await connectDB();
    await initDB();
  } catch (error) {
    console.warn('⚠️  Starting without MySQL. API routes that need the database will fail until DB settings are fixed.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
