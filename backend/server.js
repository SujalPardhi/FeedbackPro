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

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
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
        password: 'adminprpote', // Model hook will hash this
        role: 'admin',
        isApproved: true
      });
      console.log('Default admin created: noreplyprpote@gmail.com/ adminprpote');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
