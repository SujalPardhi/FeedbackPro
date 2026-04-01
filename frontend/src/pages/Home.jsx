import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Zap, Users, GraduationCap } from 'lucide-react';

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const stats = [
    { icon: <GraduationCap />, label: 'Excellence', value: 'NAAC A+' },
    { icon: <Users />, label: 'Students', value: '5000+' },
    { icon: <Zap />, label: 'Fast Process', value: 'Real-time' },
    { icon: <ShieldCheck />, label: 'Security', value: 'Encrypted' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="hero-content"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge"
            style={{ background: 'rgba(255,106,0,0.1)', color: 'var(--primary-orange)', padding: '0.4rem 1.2rem', borderRadius: '50px', fontWeight: '600', marginBottom: '1.5rem', display: 'inline-block' }}
          >
            P R Pote Patil College of Engineering & Management
          </motion.span>

          <motion.h1>
            Digital Student <br />Feedback System
          </motion.h1>

          <p>
            The ultimate platform for academic excellence. We empower voices to shape a better tomorrow
            through anonymous, transparent, and multi-layered feedback mechanisms.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="card-grid"
        style={{ marginTop: '-100px', position: 'relative', zIndex: '10' }}
      >
        {[
          { icon: <Star />, label: 'Accreditation', value: 'NAAC A++' },
          { icon: <Users />, label: 'Annual Placements', value: '800+' },
          { icon: <Zap />, label: 'Highest Package', value: '16.5 LPA' },
          { icon: <ShieldCheck />, label: 'Governance', value: 'AICTE Appr.' }
        ].map((s, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ color: 'var(--primary-orange)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <h3 className="card-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{s.value}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Industrial Connect / Achievements */}
      <section style={{ padding: '8rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '5rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem', letterSpacing: '-2px' }}>Academic & <br />Industrial Legacy</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Established in 2008 by <strong>Hon. Pravinji Pote Patil</strong>, we bridge the gap
              between academic learning and industry requirements. We are the first institution to adopt
              <strong>Project-Based Learning (PBL)</strong> at a massive scale in the region.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--primary-orange)' }}>
                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Top Recruiters</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>TCS, Amazon, Capgemini, Wipro, Tech Mahindra</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--secondary-orange)' }}>
                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>NAAC A++ Institution</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recognized for excellence in education and infrastructure.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="glass-image-container"
            style={{
              height: '450px',
              background: 'var(--accent-gradient)',
              borderRadius: '40px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ position: 'absolute', inset: '1px', background: 'var(--bg-dark)', borderRadius: '39px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(244, 106, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Star size={50} style={{ color: 'var(--primary-orange)' }} />
              </div>
              <h3 style={{ fontSize: '2.5rem', margin: '0 2rem' }}>Global Standards</h3>
              <p style={{ color: 'var(--text-secondary)', padding: '0 3rem', marginTop: '1rem' }}>Proudly serving as a hub of technical and managerial innovation since 2008.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Opinion / Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: 'var(--accent-gradient)',
          padding: '6rem 3rem',
          borderRadius: '48px',
          textAlign: 'center',
          marginBottom: '8rem',
          boxShadow: '0 40px 100px -20px rgba(238, 9, 121, 0.3)'
        }}
      >
        <h2 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '2rem', letterSpacing: '-2px' }}>Your Voice Drives <br /> Academic Success</h2>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.92)', marginBottom: '3.5rem', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
          Help us maintain our legacy of excellence. Your honest feedback helps our faculty refine
          their teaching methods and ensures the Swami Vivekanand Auditorium remains filled with
          enlightened minds.
        </p>
        <Link to="/login" className="btn" style={{ 
          background: '#971d1d', 
          color: 'white !important', 
          padding: '1.2rem 3rem', 
          fontSize: '1.1rem', 
          fontWeight: '800', 
          boxShadow: '0 10px 40px rgba(151, 29, 29, 0.4)',
          border: 'none',
          borderRadius: '50px'
        }}>
          Launch Student Portal
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
