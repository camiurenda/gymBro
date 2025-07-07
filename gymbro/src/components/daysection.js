import React, { useState, useEffect } from 'react';
import ExerciseCard from './excersicecard.js';

const DaySection = ({ day, title, theme, exercises }) => {
  // Creamos una clave única para este día para guardarla en localStorage
  const storageKey = `progress-${day}`;

  // --- El Cerebro del Componente ---

  // 1. INICIALIZACIÓN DEL ESTADO:
  // Al iniciar, intentamos cargar el progreso guardado desde localStorage.
  // Si no hay nada, creamos un objeto de progreso vacío.
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(storageKey);
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // 2. EFECTO DE GUARDADO AUTOMÁTICO:
  // Este "efecto" se ejecuta CADA VEZ que el estado `progress` cambia.
  // Guarda el estado actual en localStorage.
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);


  // 3. FUNCIÓN PARA ACTUALIZAR EL PROGRESO:
  // Esta función se la pasaremos a cada ExerciseCard.
  const handleSetCompletionChange = (exerciseTitle, setIndex) => {
    // Creamos una copia profunda del estado para no mutar el original
    const newProgress = JSON.parse(JSON.stringify(progress));

    // Si es la primera vez que interactuamos con este ejercicio, inicializamos su progreso
    if (!newProgress[exerciseTitle]) {
      const numSets = parseInt(exercises
        .flatMap(group => group.list)
        .find(ex => ex.title === exerciseTitle)
        .reps) || 0;
      newProgress[exerciseTitle] = Array(numSets).fill(false);
    }
    
    // Invertimos el estado del set (marcado/desmarcado)
    newProgress[exerciseTitle][setIndex] = !newProgress[exerciseTitle][setIndex];

    // Actualizamos el estado principal de DaySection, lo que dispara el guardado automático
    setProgress(newProgress);
  };

  return (
    <div className={`day-section ${theme}`}>
      <div className={`day-header ${theme}`}>{day} - {title}</div>
      <div className="day-content">
        {exercises.map(group => (
          <div key={group.groupName} className="muscle-group">
            <h4>{group.groupName}</h4>
            <div className="exercise-grid">
              {group.list.map(ex => (
                <ExerciseCard
                  key={ex.title}
                  title={ex.title}
                  details={ex.details}
                  muscles={ex.muscles}
                  reps={ex.reps}
                  // Le pasamos el estado guardado para este ejercicio en particular
                  setsCompleted={progress[ex.title] || []}
                  // Le pasamos la función para que nos notifique cuando algo cambie
                  onSetChange={(setIndex) => handleSetCompletionChange(ex.title, setIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaySection;