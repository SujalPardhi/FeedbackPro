const express = require('express');
const router = express.Router();
const {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
  getParticipationStats,
  getTeacherPerformance,
  toggleFeedbackSystem,
  getQuestions,
  createQuestion,
  deleteQuestion,
  getSystemStatus,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// System Status (Public or Student scope)
router.get('/status', getSystemStatus);

// Admin stats and controls
router.get('/stats', protect, authorize('admin'), getParticipationStats);
router.get('/teacher-performance', protect, authorize('admin'), getTeacherPerformance);
router.put('/toggle', protect, authorize('admin'), toggleFeedbackSystem);

// Question Management
router.route('/questions')
  .get(getQuestions)
  .post(protect, authorize('admin'), createQuestion);

router.route('/questions/:id')
  .delete(protect, authorize('admin'), deleteQuestion);

// Get feedbacks requires login (protect). Post requires protect + student
router.route('/')
  .get(protect, getFeedbacks)
  .post(protect, authorize('student'), addFeedback);

// Delete requires protect + teacher
router.route('/:id')
  .delete(protect, authorize('teacher'), deleteFeedback);

module.exports = router;
