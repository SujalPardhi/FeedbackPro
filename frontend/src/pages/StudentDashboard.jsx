import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching student dashboard data...');
        const [teachersRes, feedbacksRes, statusRes] = await Promise.all([
          axios.get('/api/auth/teachers'),
          axios.get('/api/feedback'),
          axios.get('/api/feedback/status')
        ]);
        
        console.log('Teachers count:', teachersRes.data.length);
        console.log('Feedbacks count:', feedbacksRes.data.length);
        console.log('System Active Status:', statusRes.data.isActive);

        setTeachers(teachersRes.data);
        setFeedbacks(feedbacksRes.data);
        setIsActive(statusRes.data.isActive);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const isReviewed = (teacherId) => {
    return feedbacks.some((f) => f.teacher && (f.teacher._id === teacherId || f.teacher === teacherId));
  };

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="page-title">Student Hub: {user?.name} | Roll: {user?.rollNumber}</h2>
      
      {!isActive ? (
        <div style={{ textAlign: 'center', marginTop: '6rem', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🕒</div>
          <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2rem' }}>Feedback Session on Hold</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
             The administrator has not yet deployed the current feedback cycle. 
             Please wait for an official announcement. Once deployed, your dashboard will automatically refresh with available teachers.
          </p>
          <div style={{ padding: '1rem 2rem', background: 'rgba(255, 106, 0, 0.1)', color: 'var(--primary-orange)', display: 'inline-block', borderRadius: '50px', fontWeight: 'bold' }}>
             Status: Monitoring Admin Deployment...
          </div>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '3rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Select a teacher below to provide your valuable performance feedback for the current semester.
          </p>

          {teachers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px' }}>
                <p style={{ color: '#666' }}>No professors are currently registered in your department.</p>
            </div>
          ) : (
            <div className="card-grid">
              {teachers.map((t) => {
                const alreadyReviewed = isReviewed(t._id);
                return (
                  <div className="card" key={t._id}>
                    <h3 className="card-title">{t.name}</h3>
                    <p className="card-rating" style={{ marginBottom: '1rem', opacity: 0.8, fontSize: '0.95rem' }}>Subject: {t.subjectName}</p>
                    <div style={{ marginTop: '2rem' }}>
                      {alreadyReviewed ? (
                        <button className="btn" disabled style={{ backgroundColor: '#2ed573', cursor: 'not-allowed', boxShadow: 'none', opacity: 0.9, width: '100%' }}>
                          Complete ✓
                        </button>
                      ) : (
                        <Link to={`/give-feedback/${t._id}`} className="btn" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                          Start Feedback
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
