// Polyfill crypto for Node 18 / BSON 7 / Mongoose 9
const nodeCrypto = require('crypto');
if (!global.crypto) global.crypto = nodeCrypto.webcrypto || nodeCrypto;
if (!globalThis.crypto) globalThis.crypto = global.crypto;

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

app.use(cors());
app.use(express.json());

let lastMongoError = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codraw';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    lastMongoError = null;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    lastMongoError = err.message;
    console.warn('MongoDB connection notice:', err.message);
  }
};

// Initial connection
connectDB();

// Auto-reconnect interval if connection dropped or delayed
setInterval(() => {
  if (mongoose.connection.readyState !== 1) {
    connectDB();
  }
}, 15000);

// Root informative endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    name: 'CoDraw Backend API',
    status: 'online',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    frontend: 'https://codraw-live.vercel.app',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
      },
      projects: {
        list: 'GET /api/projects',
        sync: 'POST /api/projects/sync',
        delete: 'DELETE /api/projects/:projectId',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check database connection specifically for database-backed routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/projects')) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database disconnected. Please verify MONGODB_URI in Render and ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.',
        details: lastMongoError,
      });
    }
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
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    mongoError: lastMongoError,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`CoDraw server listening on port ${PORT}`);
});
