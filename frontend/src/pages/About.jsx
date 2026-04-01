const About = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--card-bg)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 className="page-title">About Our System</h2>
      
      <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
        Welcome to the <strong>P R Pote Patil College of Engineering and Management</strong> Student Feedback System.
      </p>

      <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', color: '#555' }}>
        This platform is designed to bridge the communication gap between students and faculty. We believe that continuous, constructive feedback is the cornerstone of academic excellence and continuous improvement. 
      </p>

      <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem', marginTop: '2rem' }}>How it Works</h3>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: '#555' }}>
        <li><strong>Students:</strong> Register securely using your Roll Number, review subjects, and leave detailed analytics.</li>
        <li><strong>Teachers:</strong> Register with your assigned subject to access a custom dashboard to read and act on structured feedback.</li>
      </ul>

      <div style={{ marginTop: '3rem', padding: '1.5rem', borderLeft: '4px solid var(--primary-orange)', backgroundColor: '#fff5ec' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>P R Pote Patil College of Engineering & Management</h4>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Dedicated to building the engineers and managers of tomorrow through transparency, action, and education.</p>
      </div>
    </div>
  );
};

export default About;
