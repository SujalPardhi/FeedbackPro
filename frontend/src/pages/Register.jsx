import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', role: 'student', rollNumber: '', subjectName: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await register({
        name: formData.name, email: formData.email, password: formData.password, role: formData.role, rollNumber: formData.rollNumber, subjectName: formData.subjectName
      });
      // The backend returns { message: '...' } without a token for new registrations
      setSuccessMsg(res.message || 'Registration successful. Waiting for admin approval.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'student', rollNumber: '', subjectName: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div>
      <h2 className="page-title">Register an Account</h2>
      <div className="form-container">
        {successMsg && <div style={{ color: 'green', fontSize: '1.1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>{successMsg}</div>}
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        {!successMsg && (
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <label>
              <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} /> Student
            </label>
            <label>
              <input type="radio" name="role" value="teacher" checked={formData.role === 'teacher'} onChange={handleChange} /> Teacher
            </label>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} name="password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type={showPassword ? "text" : "password"} name="confirmPassword" className="form-control" onChange={handleChange} required />
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '0.5rem', fontWeight: 'normal', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              Show Passwords
            </label>
          </div>

          {formData.role === 'student' && (
            <div className="form-group">
              <label>Roll Number</label>
              <input type="text" name="rollNumber" className="form-control" onChange={handleChange} required />
            </div>
          )}

          {formData.role === 'teacher' && (
            <div className="form-group">
              <label>Subject Taught</label>
              <input type="text" name="subjectName" className="form-control" onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Register</button>
        </form>
        )}
        <div className="text-center">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-orange)' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
