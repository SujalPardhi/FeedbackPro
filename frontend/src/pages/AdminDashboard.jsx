import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchPendingUsers();
  }, [user, navigate]);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get('/api/auth/admin/pending');
      setPendingUsers(res.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
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

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Loading Admin Dashboard...</div>;

  return (
    <div>
      <h2 className="page-title">Master Admin Dashboard</h2>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        Approve or reject pending registration requests from Students and Teachers.
      </p>

      <div style={{ marginTop: '1rem' }}>
        <h3>Pending Approvals ({pendingUsers.length})</h3>
        {pendingUsers.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#666' }}>No pending requests right now.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Extra Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u._id}>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize', fontWeight: 'bold', color: u.role === 'teacher' ? 'var(--primary-orange)' : '#333' }}>
                      {u.role}
                    </td>
                    <td>
                      {u.role === 'student' ? `Roll No: ${u.rollNumber}` : `Subject: ${u.subjectName}`}
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
    </div>
  );
};

export default AdminDashboard;
