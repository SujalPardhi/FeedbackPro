import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FeedbackForm = () => {
  const { teacherId } = useParams();
  const [formData, setFormData] = useState({ rating: 5, message: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
        <p>You must be logged in as a student to give feedback.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError('Please fill in the message field');
      return;
    }
    
    try {
      await axios.post('/api/feedback', { ...formData, teacherId });
      navigate('/feedbacks');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong, failed to submit feedback.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="page-title">Submit Feedback</h2>
      <div className="form-container">
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
             <label>Reviewing as: <span style={{ color: 'var(--primary-orange)' }}>{user.name} ({user.rollNumber})</span></label>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1 to 5)</label>
            <select
              id="rating"
              name="rating"
              className="form-control"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Provide your detailed feedback..."
            ></textarea>
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Submit securely
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
