import React, { useState } from 'react';

const WeightLogForm = ({ onSave }) => {
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    // Llama a la función onSave pasada por props solo si el valor es válido
    if (weight && !isNaN(weight)) {
      onSave(parseFloat(weight));
    }
  };

  return (
    <div className="weight-log-form">
      <h3>Registrar Peso Corporal</h3>
      <p>Ingresa tu peso actual para seguir tu evolución.</p>
      <div className="weight-input-section">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Tu peso en kg"
          className="set-input"
        />
        <button className="save-button" onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default WeightLogForm;