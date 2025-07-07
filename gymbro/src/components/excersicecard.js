import React from 'react';

const ExerciseCard = ({ title, details, muscles, reps, setsData = [], onSetChange }) => {
  
  const numberOfSets = parseInt(reps) || 0;

  // Si no hay datos guardados, creamos una estructura por defecto.
  const sets = setsData.length > 0 ? setsData : Array(numberOfSets).fill({
    completed: false,
    weight: '',
    reps: ''
  });

  return (
    <div className="exercise-card">
      <h4>{title}</h4>
      <div className="exercise-details">
        <strong>Técnica:</strong> {details}<br />
        <strong>Músculos:</strong> {muscles}
        <div className="reps-badge">{reps}</div>
      </div>

      <div className="sets-tracker">
        <h5>Seguimiento de Series:</h5>
        <div className="sets-grid">
          {sets.map((setData, index) => (
            <div key={index} className={`set-row ${setData.completed ? 'completed' : ''}`}>
              <div className="set-label">
                <input
                  type="checkbox"
                  id={`${title}-set-${index}`}
                  checked={setData.completed}
                  onChange={(e) => onSetChange(index, 'completed', e.target.checked)}
                />
                <label htmlFor={`${title}-set-${index}`}>
                  Serie {index + 1}
                </label>
              </div>
              <div className="set-inputs">
                <input
                  type="number"
                  className="set-input"
                  placeholder="kg"
                  value={setData.weight}
                  onChange={(e) => onSetChange(index, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  className="set-input"
                  placeholder="reps"
                  value={setData.reps}
                  onChange={(e) => onSetChange(index, 'reps', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;