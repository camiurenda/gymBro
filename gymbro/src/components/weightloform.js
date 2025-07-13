import React, { useState } from 'react';
import { db } from '../firebase-config'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WeightLogForm = ({ userId, onClose }) => {
  const [weight, setWeight] = useState('');

  const handleSave = async () => {
    if (weight && !isNaN(weight) && userId) {
      try {
        await addDoc(collection(db, 'weights'), {
          userId,
          weight: parseFloat(weight),
          timestamp: serverTimestamp(),
        });
        onClose(); // Cierra el modal después de guardar
      } catch (error) {
        console.error("Error al guardar el peso: ", error);
      }
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
