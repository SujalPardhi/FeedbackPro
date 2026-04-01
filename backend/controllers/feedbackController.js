const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Add new feedback
// @route   POST /api/feedback
// @access  Private (Student only)
const addFeedback = async (req, res) => {
  try {
    const { teacherId, rating, message } = req.body;

    if (!teacherId || !rating || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Verify the teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Check if the student has already submitted feedback for this teacher
    const existingFeedback = await Feedback.findOne({
      student: req.user.id,
      teacher: teacherId,
    });

    if (existingFeedback) {
      return res.status(400).json({ error: 'You have already submitted feedback for this teacher/subject.' });
    }

    const feedback = await Feedback.create({
      student: req.user.id,
      teacher: teacherId,
      rating,
      message,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get all feedback for logged in teacher (or own student feedback)
// @route   GET /api/feedback
// @access  Private
const getFeedbacks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') {
      query = { teacher: req.user.id };
    } else if (req.user.role === 'student') {
      query = { student: req.user.id };
    }

    const feedbacks = await Feedback.find(query)
      .populate('student', 'name rollNumber')
      .populate('teacher', 'name subjectName')
      .sort({ createdAt: -1 });
      
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Teacher only)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Only allow the teacher who owns the feedback to delete it
    if (feedback.teacher.toString() !== req.user.id.toString()) {
        return res.status(401).json({ error: 'Not authorized to delete this feedback' });
    }

    await feedback.deleteOne();
    res.status(200).json({ message: 'Feedback removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
};
