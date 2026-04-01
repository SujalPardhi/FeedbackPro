const express = require('express');
const router = express.Router();
const {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get feedbacks requires login (protect). Post requires protect + student
router.route('/')
  .get(protect, getFeedbacks)
  .post(protect, authorize('student'), addFeedback);

// Delete requires protect + teacher
router.route('/:id')
  .delete(protect, authorize('teacher'), deleteFeedback);

module.exports = router;
