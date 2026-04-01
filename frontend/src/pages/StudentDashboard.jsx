import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [teachersRes, feedbacksRes] = await Promise.all([
          axios.get('/api/auth/teachers'),
          axios.get('/api/feedback')
        ]);
        setTeachers(teachersRes.data);
        setFeedbacks(feedbacksRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const isReviewed = (teacherId) => {
    return feedbacks.some((f) => f.teacher._id === teacherId);
  };

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="page-title">Welcome, {user?.name} (Roll No: {user?.rollNumber})</h2>
      <p style={{ marginBottom: '2rem' }}>Select a teacher below to submit your feedback securely.</p>

      {teachers.length === 0 ? (
        <p>No teachers have registered yet.</p>
      ) : (
        <div className="card-grid">
          {teachers.map((t) => {
            const alreadyReviewed = isReviewed(t._id);
            return (
              <div className="card" key={t._id}>
                <h3 className="card-title">{t.name}</h3>
                <p className="card-rating" style={{ marginBottom: '0.5rem' }}>Subject: {t.subjectName}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  {alreadyReviewed ? (
                    <button className="btn" disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>
                      Already Reviewed
                    </button>
                  ) : (
                    <Link to={`/give-feedback/${t._id}`} className="btn">
                      Give Feedback
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
