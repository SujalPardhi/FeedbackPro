import { motion } from 'framer-motion';
import { Target, Eye, Award, GraduationCap } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="main-content"
      style={{ paddingBottom: '8rem' }}
    >
      <div className="text-center" style={{ marginBottom: '5rem' }}>
        <h2 className="page-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'block' }}>About Our Institution</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Welcome to the <strong>P R Pote Patil College of Engineering and Management</strong> (PRPCEM), 
          an autonomous institution dedicated to academic excellence and industrial innovation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <div style={{ color: 'var(--primary-orange)', marginBottom: '1.5rem' }}>
            <Target size={40} />
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            To provide students with a solid foundation in the field of engineering and management 
            through state-of-the-art infrastructure. To bridge the gap between academic theory 
            and industrial practice by promoting innovations, research, and project-based learning.
          </p>
        </div>

        <div className="card" style={{ padding: '3rem' }}>
          <div style={{ color: 'var(--secondary-orange)', marginBottom: '1.5rem' }}>
            <Eye size={40} />
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            To be recognized globally as a premier institution for technical education and research. 
            We aim to produce ethically strong and professionally competent human resources 
            who contribute to the socio-economic development of the nation.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '8rem' }}>
        <h3 className="text-center" style={{ fontSize: '2.8rem', marginBottom: '4rem' }}>Institutional Legacy</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Global Infrastructure</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Our 10-acre Wi-Fi enabled campus features multimedia classrooms and a 10,000+ capacity auditorium.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Research & Ph.D. Center</h4>
            <p style={{ color: 'var(--text-secondary)' }}>A recognized research hub offering Ph.D. programs and fostering technical innovation across core disciplines.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Global Tech Venue</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Proud host of major international conferences like <strong>.NET Conf 2024 Amravati</strong>, driving modern tech awareness.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--accent-gradient)', padding: '5rem', textAlign: 'center', borderRadius: '48px' }}>
        <GraduationCap size={60} color="white" style={{ marginBottom: '2rem' }} />
        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '2rem' }}>NAAC A++ Distinction</h2>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', maxWidth: '900px', margin: '0 auto' }}>
          We are proud to hold the prestigious <strong>NAAC A++ Grade</strong>, a testament to our quality of education, 
          faculty expertise, and our commitment to providing students with an unparalleled academic experience.
        </p>
      </div>

      <div style={{ marginTop: '8rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Corporate Tie-Ups & Placements</h3>
        <div style={{ opacity: 0.6, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Collaborating with Industry Giants: 
          TCS • AMAZON • PERSISTENT • TECH MAHINDRA • WIPRO • CAPGEMINI • DELL • COGNIZANT
        </div>
      </div>
    </motion.div>
  );
};

export default About;
