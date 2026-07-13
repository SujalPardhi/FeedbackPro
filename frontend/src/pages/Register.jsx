import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', role: 'student', rollNumber: '', branch: '', section: '', academicYear: '', subjectName: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [successMsg, setSuccessMsg] = useState('');

  const sectionsByBranch = {
    'CSE': ['A1', 'A2', 'A3'],
    'AIDS': ['B1', 'B2', 'B3'],
    'AIML': ['C1', 'C2', 'C3']
  };

  const branches = [
    { value: 'CSE', label: 'Computer Science and Engineering' },
    { value: 'AIDS', label: 'Artificial Intelligence and Data Science' },
    { value: 'AIML', label: 'Artificial Intelligence and Machine Learning' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'ENTC', label: 'Electronics and Telecommunication Engineering' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'MBA', label: 'MBA' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'branch') {
      setFormData({ ...formData, branch: value, section: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        name: formData.name, email: formData.email, password: formData.password, role: formData.role, rollNumber: formData.rollNumber, branch: formData.branch, section: formData.section, academicYear: formData.academicYear, subjectName: formData.subjectName
      });
      // The backend returns { message: '...' } without a token for new registrations
      setSuccessMsg(res.message || 'Registration successful. Waiting for admin approval.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'student', rollNumber: '', branch: '', section: '', academicYear: '', subjectName: '' });
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
          <div className="form-group radio-group" style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', marginBottom: '2.5rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0, fontSize: '1rem' }}>
              <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} /> Student
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0, fontSize: '1rem' }}>
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

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label>Roll Number</label>
                <input type="text" name="rollNumber" className="form-control" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <select name="branch" className="form-control" onChange={handleChange} required value={formData.branch}>
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              
              {sectionsByBranch[formData.branch] && (
                <div className="form-group">
                  <label>Section</label>
                  <select name="section" className="form-control" onChange={handleChange} required value={formData.section}>
                    <option value="">Select Section</option>
                    {sectionsByBranch[formData.branch].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Academic Year</label>
                <select name="academicYear" className="form-control" onChange={handleChange} required value={formData.academicYear}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>
            </>
          )}

          {formData.role === 'teacher' && (
            <div className="form-group">
              <label>Subject Taught</label>
              <input type="text" name="subjectName" className="form-control" onChange={handleChange} required />
            </div>
          )}

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
