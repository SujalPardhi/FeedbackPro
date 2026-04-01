import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeedbackCard from '../components/FeedbackCard';
import { AuthContext } from '../context/AuthContext';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('/api/feedback');
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center" style={{ marginTop: '3rem' }}>Loading feedbacks...</div>;
  }

  return (
    <div>
      <h2 className="page-title">{user.role === 'teacher' ? 'Your Feedbacks' : 'My Feedbacks'}</h2>
      {feedbacks.length === 0 ? (
        <p className="text-center">No feedbacks found.</p>
      ) : (
        <div className="card-grid">
          {feedbacks.map((fb) => (
             <FeedbackCard key={fb._id} feedback={fb} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
