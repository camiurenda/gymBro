import React from 'react';


// El componente ahora recibe dos nuevas props: `setsCompleted` y `onSetChange`
const ExerciseCard = ({ title, details, muscles, reps, setsCompleted, onSetChange }) => {
  
  const numberOfSets = parseInt(reps) || 0;

  // Creamos un array de la longitud correcta en caso de que aún no haya progreso guardado
  const setsStatus = setsCompleted.length > 0 ? setsCompleted : Array(numberOfSets).fill(false);

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
        <div className="sets-checkboxes">
          {setsStatus.map((isCompleted, index) => (
            <div key={index} className="set-item">
              <input
                type="checkbox"
                id={`${title}-set-${index}`}
                checked={isCompleted}
                // Al cambiar, ya no maneja la lógica aquí.
                // Simplemente llama a la función que le pasó su padre (DaySection).
                onChange={() => onSetChange(index)}
              />
              <label htmlFor={`${title}-set-${index}`}>
                Serie {index + 1}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;