import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, studentsWhoGaveFeedback: 0, remainingStudents: 0, percentage: 0, isActive: false });
  const [performance, setPerformance] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pendingRes, statsRes, performanceRes, questionsRes] = await Promise.all([
        axios.get('/api/auth/admin/pending'),
        axios.get('/api/feedback/stats'),
        axios.get('/api/feedback/teacher-performance'),
        axios.get('/api/feedback/questions')
      ]);
      setPendingUsers(pendingRes.data);
      setStats(statsRes.data);
      setPerformance(performanceRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion) return;
    try {
      const res = await axios.post('/api/feedback/questions', { text: newQuestion, order: questions.length });
      setQuestions([...questions, res.data]);
      setNewQuestion('');
    } catch (err) {
      alert('Error adding question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/feedback/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      alert('Error deleting question');
    }
  };

  const handleToggleSystem = async () => {
    try {
      const res = await axios.put('/api/feedback/toggle', { active: !stats.isActive });
      alert(`Feedback system ${!stats.isActive ? 'DEPLOYED' : 'HELD'} successfully!`);
      // Re-fetch to ensure all stats (including isActive) are in sync
      fetchAllData();
    } catch (err) {
      alert('Error toggling system');
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/auth/admin/approve/${id}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
      alert('User approved successfully!');
    } catch (error) {
      alert('Error approving user');
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject and delete this request?')) {
      try {
        await axios.delete(`/api/auth/admin/reject/${id}`);
        setPendingUsers(pendingUsers.filter(u => u._id !== id));
      } catch (error) {
        alert('Error rejecting user');
        console.error(error);
      }
    }
  };

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Loading Master Admin Control...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="page-title">Master Admin Control Panel</h2>
      
      {/* System Status and Control */}
      <div style={{ background: stats.isActive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', border: `1px solid ${stats.isActive ? '#28a745' : '#dc3545'}`, padding: '2rem', borderRadius: '24px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: stats.isActive ? '#2ed573' : '#ff4757' }}>
            System Status: {stats.isActive ? 'DEPLOYED (Accepting Feedback)' : 'HELD (Paused)'}
          </h3>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
            Only the Admin can enable or disable the feedback submission process for students.
          </p>
        </div>
        <button 
          onClick={handleToggleSystem} 
          className="btn" 
          style={{ background: stats.isActive ? '#dc3545' : '#28a745', boxShadow: 'none' }}
        >
          {stats.isActive ? 'Hold Feedback' : 'Deploy Feedback'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' }}>
          <div className="stat-number">{stats.totalStudents}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Students</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #2ed573 0%, #7bed9f 100%)' }}>
          <div className="stat-number">{stats.studentsWhoGaveFeedback}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Feedback Completed</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffa502 0%, #ff7f50 100%)' }}>
          <div className="stat-number">{stats.remainingStudents}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Remaining Students</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--accent-gradient)' }}>
          <div className="stat-number">{stats.percentage}%</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Participation Rate</div>
        </div>
      </div>

      {/* Teacher Performance */}
      <div style={{ marginTop: '4rem' }}>
        <h3>Teacher Performance Analysis</h3>
        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Subject</th>
                <th>Total Reviews</th>
                <th>Avg Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {performance.map(t => (
                <tr key={t.teacherId}>
                  <td>{t.name}</td>
                  <td>{t.subject}</td>
                  <td>{t.totalFeedback}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--primary-orange)' }}>{t.avgRating} / 5.0</td>
                  <td>
                    <span style={{ padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', background: t.avgRating >= 4 ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 106, 0, 0.2)', color: t.avgRating >= 4 ? '#2ed573' : 'var(--primary-orange)' }}>
                      {t.avgRating >= 4 ? 'Excellent' : t.avgRating >= 3 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Feedback Structure */}
      <div style={{ marginTop: '5rem', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Manage Feedback Structure</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Design the feedback form by adding parameters (questions) for students to evaluate.
        </p>

        <div style={{ marginBottom: '3rem' }}>
           <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Active Parameters</h4>
           {questions.length === 0 ? (
             <p style={{ color: '#666' }}>No custom questions added yet. The form will fall back to its defaults.</p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {questions.map((q, idx) => (
                 <div key={q._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                   <span>{idx + 1}. {q.text}</span>
                   <button 
                        onClick={() => handleDeleteQuestion(q._id)} 
                        style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontWeight: '600' }}
                   >
                     Remove
                   </button>
                 </div>
               ))}
             </div>
           )}
        </div>

        <form onSubmit={handleAddQuestion} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Add New Parameter</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g., Teaching Quality, Subject Knowledge, punctuality..." 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn">Add Parameter</button>
          </div>
        </form>
      </div>

      {/* Pending User Approvals */}
      <div style={{ marginTop: '4rem' }}>
        <h3>Pending Access Requests - {pendingUsers.length}</h3>
        {pendingUsers.length === 0 ? (
          <p style={{ marginTop: '1.5rem', color: '#a0a0a8', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            No pending registration requests.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u._id}>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize', fontWeight: 'bold', color: u.role === 'teacher' ? 'var(--primary-orange)' : 'var(--text-primary)' }}>
                      {u.role}
                    </td>
                    <td>
                      {u.role === 'student' ? `Roll No: ${u.rollNumber}` : `Sub: ${u.subjectName}`}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn" 
                        onClick={() => handleApprove(u._id)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', backgroundColor: '#28a745' }}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleReject(u._id)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
         <button className="btn btn-secondary" onClick={() => navigate('/feedbacks')}>
            View Detailed Raw Feedbacks
         </button>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
