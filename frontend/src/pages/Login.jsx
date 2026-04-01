import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData);
      if (user.role === 'student') navigate('/student-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div>
      <h2 className="page-title">Login</h2>
      <div className="form-container">
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              className="form-control" 
              onChange={handleChange} 
              required 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.8rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '400', margin: 0, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                Show Password
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--primary-orange)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Login</button>
          <div className="text-center">
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-orange)' }}>Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
