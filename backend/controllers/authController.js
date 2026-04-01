const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, subjectName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please add all required fields' });
    }

    if (role === 'student' && !rollNumber) {
      return res.status(400).json({ error: 'Students must provide a roll number' });
    }

    if (role === 'teacher' && !subjectName) {
      return res.status(400).json({ error: 'Teachers must provide a subject name' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user. isApproved defaults to false unless role is admin (handled in seed)
    const user = await User.create({
      name,
      email,
      password,
      role,
      rollNumber: role === 'student' ? rollNumber : undefined,
      subjectName: role === 'teacher' ? subjectName : undefined
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful! Please wait for admin approval before logging in.'
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error.message, error.stack);
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Convert email to lowercase to prevent case sensitivity issues
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      // Check if user is approved
      if (!user.isApproved && user.role !== 'admin') {
        return res.status(403).json({ error: 'Account pending admin approval' });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Get all active teachers
// @route   GET /api/auth/teachers
// @access  Public
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', isApproved: true }).select('-password -email');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// --- ADMIN ROUTES ---

// @desc    Get pending users
// @route   GET /api/auth/admin/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, role: { $ne: 'admin' } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Approve a user
// @route   PUT /api/auth/admin/approve/:id
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    // Use findByIdAndUpdate to bypass pre-save hooks and validators
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true, runValidators: false }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};

// @desc    Reject (delete) a user request
// @route   DELETE /api/auth/admin/reject/:id
// @access  Private/Admin
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.deleteOne();
    res.status(200).json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// --- FORGOT PASSWORD ---

const sendEmail = require('../utils/sendEmail');

// @desc    Forgot Password (Generate OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ error: 'User with this email does not exist' });

    // Generate random 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 min)
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send the email
    const message = `
      <h2>Forgot Password Request</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. You can use the following OTP to reset your password:</p>
      <h3 style="color: #ff6600; font-size: 24px;">${otp}</h3>
      <p>This OTP is only valid for 10 minutes.</p>
    `;

    // If email is not configured, return OTP directly (development mode)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      return res.status(200).json({
        message: `[DEV MODE] OTP generated. Since email is not configured, your OTP is: ${otp}. Use this to reset your password.`,
        devOtp: otp
      });
    }

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - Student Feedback Pro',
        html: message,
      });

      res.status(200).json({ message: 'OTP sent to your email successfully.' });
    } catch (err) {
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Email could not be sent. Please configure EMAIL_USER and EMAIL_PASS.' });

    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Reset Password (Validate OTP)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate OTP and Expiry
    if (user.resetOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Set new password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getTeachers,
  getPendingUsers,
  approveUser,
  rejectUser,
  forgotPassword,
  resetPassword
};
