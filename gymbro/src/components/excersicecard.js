import React, { useState } from 'react'; // 1. Importamos useState

const ExerciseCard = ({ title, details, muscles, reps }) => {
  // 2. Extraemos dinámicamente el número de series de la prop 'reps'
  const numberOfSets = parseInt(reps) || 0; // Busca el primer número en "3 series x 12 reps"

  // 3. Creamos un "estado" para este componente. Será un array de booleanos
  // para saber si cada serie está completa o no.
  // Por ejemplo, para 3 series, el estado inicial será: [false, false, false]
  const [setsCompleted, setSetsCompleted] = useState(Array(numberOfSets).fill(false));

  // 4. Esta función se ejecuta cada vez que hacemos clic en un checkbox
  const handleCheckboxChange = (index) => {
    // Creamos una copia del array de estado actual
    const newSetsCompleted = [...setsCompleted];
    // Invertimos el valor del checkbox que se clickeó (de false a true y viceversa)
    newSetsCompleted[index] = !newSetsCompleted[index];
    // Actualizamos el estado con el nuevo array
    setSetsCompleted(newSetsCompleted);
  };

  return (
    <div className="exercise-card">
      <h4>{title}</h4>
      <div className="exercise-details">
        <strong>Técnica:</strong> {details}<br />
        <strong>Músculos:</strong> {muscles}
        <div className="reps-badge">{reps}</div>
      </div>

      {/* 5. Nueva sección para los checkboxes de las series */}
      <div className="sets-tracker">
        <h5>Seguimiento de Series:</h5>
        <div className="sets-checkboxes">
          {setsCompleted.map((isCompleted, index) => (
            <div key={index} className="set-item">
              <input
                type="checkbox"
                id={`${title}-set-${index}`} // ID único para cada checkbox
                checked={isCompleted}
                onChange={() => handleCheckboxChange(index)}
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