import React from 'react';

const ExerciseCard = ({ title, details, muscles, reps }) => (
    <div className="exercise-card">
        <h4>{title}</h4>
        <div className="exercise-details">
            <strong>Técnica:</strong> {details}<br />
            <strong>Músculos:</strong> {muscles}
            <div className="reps-badge">{reps}</div>
        </div>
    </div>
);

export default ExerciseCard;