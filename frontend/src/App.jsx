import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackList from './pages/FeedbackList';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ParticleBackground />
          <div className="mouse-mask"></div>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/give-feedback/:teacherId" element={<FeedbackForm />} />
              <Route path="/feedbacks" element={<FeedbackList />} />
              <Route path="/dashboard" element={<TeacherDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
