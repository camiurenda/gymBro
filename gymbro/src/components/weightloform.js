// src/components/weightloform.js
import React, { useState } from 'react';
import { db } from '../firebase-config';
// Importamos las funciones necesarias de firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WeightLogForm = ({ userId, onClose }) => {
  const [weight, setWeight] = useState('');

  const handleSave = async () => {
    if (weight && !isNaN(weight) && userId) {
      try {
        // Apuntamos a la colección 'weights'
        await addDoc(collection(db, 'weights'), {
          userId: userId, // Guardamos el ID del usuario para las reglas de seguridad
          weight: parseFloat(weight),
          timestamp: serverTimestamp(), // Firestore pone la fecha y hora del servidor
        });
        onClose(); // Cierra el modal después de guardar
      } catch (error) {
        console.error("Error al guardar el peso: ", error);
        alert("Hubo un error al guardar tu peso. Revisa las reglas de seguridad de Firestore.");
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