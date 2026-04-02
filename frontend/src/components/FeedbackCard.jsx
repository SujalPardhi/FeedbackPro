import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FeedbackCard = ({ feedback }) => {
  const { user } = useContext(AuthContext);
  const date = new Date(feedback.createdAt).toLocaleDateString();

  return (
    <div className="card">
      <h3 className="card-title">Subject: {feedback.teacher?.subjectName || 'Unknown Subject'}</h3>
      <div className="card-rating">
        {'★'.repeat(feedback.rating)}
        {'☆'.repeat(5 - feedback.rating)}
      </div>
      <p className="card-text">"{feedback.message}"</p>

      {/* Detailed Question Responses */}
      {feedback.responses && feedback.responses.length > 0 && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.8rem', opacity: 0.6 }}>Metric Breakdown</div>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {feedback.responses.map((resp, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ opacity: 0.8 }}>{resp.questionText}</span>
                <span style={{ color: 'var(--primary-orange)', fontWeight: 'bold' }}>{resp.rating} / 5</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="card-footer">
        {(user?.role === 'teacher' || user?.role === 'admin') && <span>By: {feedback.student?.name || 'Unknown'} | Roll: {feedback.student?.rollNumber || 'N/A'}</span>}
        {(user?.role === 'student' || user?.role === 'admin') && <span>Teacher: {feedback.teacher?.name || 'Unknown'}</span>}
        <span>{date}</span>
      </div>
    </div>
  );
};

export default FeedbackCard;
