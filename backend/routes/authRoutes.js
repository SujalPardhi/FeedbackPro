const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getTeachers,
  getPendingUsers,
  approveUser,
  rejectUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.get('/teachers', getTeachers); // Used by students to select a teacher

// Admin endpoints
router.get('/admin/pending', protect, authorize('admin'), getPendingUsers);
router.put('/admin/approve/:id', protect, authorize('admin'), approveUser);
router.delete('/admin/reject/:id', protect, authorize('admin'), rejectUser);

module.exports = router;
