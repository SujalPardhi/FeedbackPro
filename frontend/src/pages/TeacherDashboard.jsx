import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TeacherDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`/api/feedback/${id}`);
        setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Failed to delete feedback');
      }
    }
  };

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Loading dashboard...</div>;

  const totalFeedback = feedbacks.length;
  const avgRating = totalFeedback > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback).toFixed(1) 
    : 0;

  return (
    <div>
      <h2 className="page-title">Teacher Dashboard</h2>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        Welcome back, <strong>{user.name}</strong>. Here is the feedback for your subject securely gathered from students.
      </p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{totalFeedback}</div>
          <div>Total Student Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgRating}</div>
          <div>Average Rating (1-5)</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Manage Feedbacks</h3>
        {feedbacks.length === 0 ? (
          <p>No feedbacks to manage.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Rating</th>
                  <th>Message Snippet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb._id}>
                    <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                    <td>{fb.student?.name || 'Unknown'}</td>
                    <td>{fb.student?.rollNumber || 'Unknown'}</td>
                    <td style={{ color: 'var(--primary-orange)', fontWeight: 'bold' }}>
                      {fb.rating} ★
                    </td>
                    <td>{fb.message.length > 50 ? `${fb.message.substring(0, 50)}...` : fb.message}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(fb._id)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
