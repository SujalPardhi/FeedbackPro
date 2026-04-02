const Feedback = require('../models/Feedback');
const User = require('../models/User');
const GlobalConfig = require('../models/GlobalConfig');
const Question = require('../models/Question');

// Helper to check if feedback is active
const isFeedbackActive = async () => {
    const config = await GlobalConfig.findOne({ key: 'feedback_active' });
    return config ? config.value : false;
};

// @desc    Add new feedback with structured responses
// @route   POST /api/feedback
// @access  Private (Student only)
const addFeedback = async (req, res) => {
  try {
    const { teacherId, message, responses } = req.body;

    // Check if feedback system is active
    const active = await isFeedbackActive();
    if (!active) {
        return res.status(403).json({ error: 'Feedback submission is currently closed by Admin' });
    }

    if (!teacherId || !message || !responses || !responses.length) {
      return res.status(400).json({ error: 'Please provide all required fields and ratings' });
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

    // Calculate overall average rating from responses
    const totalRating = responses.reduce((acc, current) => acc + Number(current.rating), 0);
    const avgRating = (totalRating / responses.length);

    const feedback = await Feedback.create({
      student: req.user.id,
      teacher: teacherId,
      responses,
      rating: Math.round(avgRating), // Summary rating
      message,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// @desc    Get Questions for the feedback form
// @route   GET /api/feedback/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort('order');
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Create a new question (Admin only)
// @route   POST /api/feedback/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
    try {
        const { text, order } = req.body;
        if(!text) return res.status(400).json({ error: 'Question text is required' });
        const question = await Question.create({ text, order });
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Delete a question (Admin only)
// @route   DELETE /api/feedback/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if(!question) return res.status(404).json({ error: 'Question not found' });
        await question.deleteOne();
        res.status(200).json({ message: 'Question removed' });
    } catch (err) {
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

// @desc    Get Participation Statistics (Admin only)
// @route   GET /api/feedback/stats
// @access  Private/Admin
const getParticipationStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student', isApproved: true });
        
        // Use set to count unique students who gave feedback
        const distinctStudentFeedbacks = await Feedback.distinct('student');
        const studentsWhoGaveFeedback = distinctStudentFeedbacks.length;
        
        const remainingStudents = totalStudents - studentsWhoGaveFeedback;
        const percentage = totalStudents > 0 ? ((studentsWhoGaveFeedback / totalStudents) * 100).toFixed(2) : 0;
        
        const isActive = await isFeedbackActive();

        res.status(200).json({
            totalStudents,
            studentsWhoGaveFeedback,
            remainingStudents,
            percentage,
            isActive
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get Performance per Teacher (Admin only)
// @route   GET /api/feedback/teacher-performance
// @access  Private/Admin
const getTeacherPerformance = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', isApproved: true }).select('name subjectName');
        
        const performance = await Promise.all(teachers.map(async (teacher) => {
            const feedbacks = await Feedback.find({ teacher: teacher._id });
            const total = feedbacks.length;
            const avgRating = total > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / total).toFixed(1) : 0;
            return {
                teacherId: teacher._id,
                name: teacher.name,
                subject: teacher.subjectName,
                totalFeedback: total,
                avgRating
            };
        }));
        
        res.status(200).json(performance);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Toggle feedback system active state
// @route   PUT /api/feedback/toggle
// @access  Private/Admin
const toggleFeedbackSystem = async (req, res) => {
    try {
        const { active } = req.body;
        await GlobalConfig.findOneAndUpdate(
            { key: 'feedback_active' },
            { value: active },
            { upsert: true }
        );
        res.status(200).json({ message: `Feedback system ${active ? 'deployed' : 'held'} successfully`, active });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

const getSystemStatus = async (req, res) => {
    try {
        const isActive = await isFeedbackActive();
        res.status(200).json({ isActive });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
  getParticipationStats,
  getTeacherPerformance,
  toggleFeedbackSystem,
  getQuestions,
  createQuestion,
  deleteQuestion,
  getSystemStatus
};
