// Polyfill for Bun < 1.4 compatibility with Mongoose 9 / BSON 7
const originalGet = globalThis.process?.getBuiltinModule;
if (originalGet) {
  globalThis.process.getBuiltinModule = function(mod) {
    if (mod === 'v8') return {};
    return originalGet.apply(this, arguments);
  };
}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codraw';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.warn('MongoDB connection notice:', err.message));

// Middleware to check database connection for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/health')) return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database disconnected. Please check your MONGODB_URI in server/.env and verify your IP is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0). Guest Mode works 100% offline in browser.',
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`CoDraw server listening on port ${PORT}`);
});
