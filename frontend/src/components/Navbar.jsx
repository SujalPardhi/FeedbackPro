import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <div className="brand-logo">
          <GraduationCap size={24} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          PRPCEM <span style={{ fontWeight: 400, opacity: 0.7, fontSize: '0.9rem', verticalAlign: 'middle', marginLeft: '5px' }}>Feedback</span>
        </div>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/feedbacks">View Feedbacks</Link>
        
        {user ? (
          <>
            {user.role === 'student' && <Link to="/student-dashboard">Dashboard</Link>}
            {user.role === 'teacher' && <Link to="/dashboard">Dashboard</Link>}
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={handleLogout} className="btn" style={{ marginLeft: '1.5rem', padding: '0.4rem 1rem' }}>
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn" style={{ marginLeft: '1.5rem', padding: '0.4rem 1rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
