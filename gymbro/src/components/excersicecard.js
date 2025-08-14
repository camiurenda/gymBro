import React from 'react';

/**
 * ExerciseCard: Un componente "controlado" que muestra un solo ejercicio.
 * No tiene estado propio; recibe todos sus datos y funciones de su padre (DaySection).
 * * Props:
 * - exerciseData: Un objeto con toda la info del ejercicio (title, details, reps, gifUrl, etc.).
 * - setsData: Un array de objetos, donde cada objeto representa una serie ({ completed, weight, reps }).
 * - onSetChange: Una función que se llama cuando se modifica cualquier input de una serie (el checkbox, el peso o las reps).
 * - onSave: Una función que se llama para guardar el progreso del ejercicio actual.
 * - onCardClick: Una función que se llama cuando se hace clic en la tarjeta para abrir el modal de detalles.
 * - isCompleted: Un booleano que indica si el ejercicio se ha guardado al menos una vez.
 * - isEditing: Un booleano que indica si la tarjeta está en modo de edición.
 * - onEditClick: Una función que se llama para activar el modo de edición.
 * - maxWeight: El peso máximo histórico levantado para este ejercicio.
 */
const ExerciseCard = ({ exerciseData = {}, setsData = [], onSetChange, onSave, onCardClick, isCompleted, isEditing, onEditClick, maxWeight }) => {
// Desestructuramos los datos del ejercicio para usarlos más fácilmente en el JSX.
  const { title, details, muscles, reps } = exerciseData;

  // Calculamos el número de series para tener un valor de respaldo.
  const numberOfSets = parseInt(reps) || 0;

  // Si no hay datos de progreso guardados para este ejercicio, creamos una estructura por defecto para mostrar.
  const sets = setsData.length > 0 ? setsData : Array.from({ length: numberOfSets }, () => ({
    completed: false,
    weight: '',
    reps: ''
  }));

  return (
    // 1. La tarjeta entera es clicable y llama a `onCardClick` para abrir el modal.
    //    La clase 'clickable' le da el cursor de puntero.
    //    Añadimos la clase 'finished' si el ejercicio está completado.
    <div className={`exercise-card clickable ${isCompleted ? 'finished' : ''}`} onClick={onCardClick}>
      
      <div className="exercise-header">
        <h4>{title}</h4>
        {isCompleted && <span className="completed-check">✓</span>}
      </div>
      <div className="exercise-details">
        <strong>Técnica:</strong> {details}<br />
        <strong>Músculos:</strong> {muscles}
        {maxWeight > 0 ? (
          <div className="reps-badge pr-badge">PR: {maxWeight}kg</div>
        ) : (
          <div className="reps-badge">{reps}</div>
        )}
      </div>

      {/* 2. El contenedor del tracker detiene la propagación del clic.
             Esto es un truco para que, si hacés clic en un input o checkbox,
             NO se dispare el `onClick` de la tarjeta principal y no se abra el modal. */}
      {(!isCompleted || isEditing) && (
      <div className="sets-tracker" onClick={(e) => e.stopPropagation()}>
        <h5>Seguimiento de Series:</h5>
        <div className="sets-grid">
          {sets.map((setData, index) => (
            // La clase 'completed' se añade condicionalmente para el estilo visual.
            <div key={index} className={`set-row ${setData.completed ? 'completed' : ''}`}>
              <div className="set-label">
                <input
                  type="checkbox"
                  id={`${title}-set-${index}`}
                  checked={setData.completed}
                  // Llama a la función del padre pasándole el índice, el campo a cambiar ('completed') y el nuevo valor.
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
                  // Llama a la función del padre pasándole el índice, el campo ('weight') y el nuevo valor.
                  onChange={(e) => onSetChange(index, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  className="set-input"
                  placeholder="reps"
                  value={setData.reps}
                   // Llama a la función del padre pasándole el índice, el campo ('reps') y el nuevo valor.
                  onChange={(e) => onSetChange(index, 'reps', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      <div className="card-footer">
          {!isCompleted && (
            <button 
              className="save-progress-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              Guardar Progreso
            </button>
          )}
          {isCompleted && !isEditing && (
            <button 
              className="edit-progress-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
            >
              Editar
            </button>
          )}
          {isEditing && (
            <button 
              className="save-progress-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              Guardar Cambios
            </button>
          )}
        </div>
    </div>
  );
};

export default ExerciseCard;
