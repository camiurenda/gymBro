import React, { useState } from 'react';
import Modal from './modal';

const FeedbackModal = ({ isOpen, onClose, completedExercises, onSubmit, aiFeedback }) => {
  const [hardestExercise, setHardestExercise] = useState('');
  const [feeling, setFeeling] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ hardestExercise, feeling });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="feedback-modal-content">
        <h2>Feedback del Día</h2>
        {aiFeedback ? (
          <div className="ai-feedback">
            <h3>Feedback de Gemini Coach:</h3>
            <p>{aiFeedback}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hardest-exercise">¿Qué ejercicio te costó más hoy?</label>
              <select
                id="hardest-exercise"
                value={hardestExercise}
                onChange={(e) => setHardestExercise(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona un ejercicio</option>
                {completedExercises.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>En una palabra, ¿cómo te sentiste al terminar?</label>
              <div className="feeling-options">
                {['Cansado/a', 'Energético/a', 'Fuerte', 'Adolorido/a'].map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`feeling-btn ${feeling === f ? 'selected' : ''}`}
                    onClick={() => setFeeling(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-feedback-btn" disabled={!hardestExercise || !feeling}>
              Obtener Feedback
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default FeedbackModal;