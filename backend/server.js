require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server immediately so hosting platforms can detect an open port.
let dbConnected = false;
const startServer = () => app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
startServer();

// Health check
app.get('/health', (req, res) => {
  return res.json({ status: 'ok', db: dbConnected });
});

// Database Connection (connect but don't exit on failure)
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not set. Please set the MONGO_URI environment variable.');
} else {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      dbConnected = true;
      console.log('MongoDB Connected');

      const GlobalConfig = require('./models/GlobalConfig');
      const config = await GlobalConfig.findOne({ key: 'feedback_active' });
      console.log(`[BOOT] Feedback System Status: ${config ? (config.value ? 'DEPLOYED' : 'HELD') : 'NEVER DEPLOYED (Default: OFF)'}`);

      // Admin Account Seeding
      const User = require('./models/User');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        console.log('No admin found. Creating default admin...');
        await User.create({
          name: 'Master Admin',
          email: 'noreplyprpote@gmail.com',
          password: 'adminprpote',
          role: 'admin',
          isApproved: true
        });
        console.log('Default admin created: noreplyprpote@gmail.com/ adminprpote');
      }
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}
