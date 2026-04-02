import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FeedbackForm = () => {
  const { teacherId } = useParams();
  const [formData, setFormData] = useState({ message: '' });
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({}); // { questionId: rating }
  const [error, setError] = useState('');
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [teacherName, setTeacherName] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, questionsRes, teachersRes] = await Promise.all([
          axios.get('/api/feedback/status'),
          axios.get('/api/feedback/questions'),
          axios.get('/api/auth/teachers')
        ]);
        
        setIsSystemActive(statusRes.data.isActive);
        setQuestions(questionsRes.data);
        
        // Find teacher name
        const teacher = teachersRes.data.find(t => t._id === teacherId);
        if (teacher) setTeacherName(teacher.name);

        // Initialize responses with 5
        const initialResponses = {};
        questionsRes.data.forEach(q => initialResponses[q._id] = 5);
        setResponses(initialResponses);

      } catch (err) {
        console.error('Error fetching data');
      } finally {
        setCheckingStatus(false);
      }
    };
    fetchData();
  }, [teacherId]);

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
        <p>You must be logged in as a student to give feedback.</p>
      </div>
    );
  }

  if (checkingStatus) return <div className="text-center" style={{ marginTop: '3rem' }}>Checking system status...</div>;

  if (!isSystemActive) {
    return (
      <div className="text-center" style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(220, 53, 69, 0.05)', borderRadius: '24px', border: '1px solid #dc3545', maxWidth: '600px', margin: '5rem auto' }}>
        <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Feedback System Paused</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          The administrator has currently held the feedback submission process. 
          Please check back later when it is deployed to your login.
        </p>
        <button className="btn btn-secondary" style={{ marginTop: '2rem' }} onClick={() => navigate('/student-dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleRatingChange = (questionId, rating) => {
    setResponses({ ...responses, [questionId]: Number(rating) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || (questions.length > 0 && questions.length !== Object.keys(responses).length)) {
      setError('Please provide ratings for all questions and a detailed message.');
      return;
    }
    
    try {
      const formattedResponses = questions.map(q => ({
        questionText: q.text,
        rating: responses[q._id] || 5
      }));

      await axios.post('/api/feedback', { 
         ...formData, 
         teacherId, 
         responses: formattedResponses 
      });
      navigate('/feedbacks');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong, failed to submit feedback.');
    }
  };

  return (
    <div>
      <h2 className="page-title">Submit Feedback</h2>
      <div className="form-container" style={{ maxWidth: '750px' }}>
        {error && <div style={{ color: '#ff4757', padding: '1rem', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
             <label style={{ fontSize: '1rem', opacity: 0.7 }}>Reviewing Professor</label>
             <div style={{ fontSize: '1.8rem', fontWeight: '800', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                {teacherName || "Loading..."}
             </div>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
             <h4 style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'white' }}>Performance Evaluation</h4>
             <div style={{ display: 'grid', gap: '2.5rem' }}>
                {questions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No specific evaluation parameters set. Please provide a general review below.</p>
                ) : (
                    questions.map((q) => (
                    <div key={q._id} className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'white !important', fontSize: '1rem !important', marginBottom: '1.2rem !important', fontWeight: '500!important' }}>{q.text}</label>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {[5, 4, 3, 2, 1].map((num) => (
                            <button
                            key={num}
                            type="button"
                            onClick={() => handleRatingChange(q._id, num)}
                            style={{
                                padding: '0.7rem 1.4rem',
                                borderRadius: '14px',
                                border: '1px solid var(--glass-border)',
                                background: responses[q._id] === num ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: responses[q._id] === num ? '700' : '400',
                                transform: responses[q._id] === num ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: responses[q._id] === num ? '0 10px 20px rgba(255, 106, 0, 0.2)' : 'none'
                            }}
                            >
                            {num === 5 ? 'Excellent' : num === 4 ? 'Good' : num === 3 ? 'Average' : num === 2 ? 'Poor' : 'Fail'}
                            </button>
                        ))}
                        </div>
                    </div>
                    ))
                )}
             </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Written Review</label>
            <textarea
              id="message"
              className="form-control"
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="What did you think of the course quality and professor's teaching style?"
              style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}
            ></textarea>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}>
            Submit Performance Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
