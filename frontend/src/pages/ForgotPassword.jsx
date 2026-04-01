import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      // Dev mode: auto-fill OTP if returned directly
      if (res.data.devOtp) {
        setOtp(res.data.devOtp);
      }
      setStep(2); // Move to OTP input step
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Forgot Password</h2>
      <div className="form-container">
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {message && <div style={{ color: 'green', fontSize: '1.1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>{message}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <p style={{ marginBottom: '1.5rem', color: '#555' }}>Enter your registered email address to receive a 6-digit verification code.</p>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <p style={{ marginBottom: '1.5rem', color: '#555' }}>Please enter the 6-digit OTP sent to <strong>{email}</strong>.</p>
            
            <div className="form-group">
              <label>6-Digit OTP</label>
              <input type="text" className="form-control" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '0.5rem', fontWeight: 'normal', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                Show Passwords
              </label>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center" style={{ marginTop: '1rem' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--primary-orange)' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
