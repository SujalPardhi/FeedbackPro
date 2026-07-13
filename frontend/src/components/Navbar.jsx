import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <div className="brand-logo">
          <GraduationCap size={24} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          PRPCEM <span style={{ fontWeight: 400, opacity: 0.7, fontSize: '0.9rem', verticalAlign: 'middle', marginLeft: '5px' }}>Feedback</span>
        </div>
      </Link>
      <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About Us</Link>
        <Link to="/feedbacks" onClick={closeMenu}>View Feedbacks</Link>
        
        {user ? (
          <>
            {user.role === 'student' && <Link to="/student-dashboard" onClick={closeMenu}>Dashboard</Link>}
            {user.role === 'teacher' && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
            {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin Panel</Link>}
            <button onClick={handleLogout} className="btn" style={{ marginLeft: '1.5rem', padding: '0.4rem 1rem', whiteSpace: 'nowrap' }}>
              Logout - {user.name}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="btn" onClick={closeMenu} style={{ marginLeft: '1.5rem', padding: '0.4rem 1rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
