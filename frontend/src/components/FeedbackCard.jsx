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
      <div className="card-footer">
        {user?.role === 'teacher' && <span>By: {feedback.student?.name || 'Unknown'} (Roll: {feedback.student?.rollNumber || 'N/A'})</span>}
        {user?.role === 'student' && <span>Teacher: {feedback.teacher?.name || 'Unknown'}</span>}
        <span>{date}</span>
      </div>
    </div>
  );
};

export default FeedbackCard;
