import React, { useState, useEffect } from 'react';
import ExerciseCard from './excersicecard';

const DaySection = ({ day, title, theme, exercises }) => {
  const storageKey = `progress-${day}`;

  // El estado ahora guardará objetos más complejos.
  // Ejemplo: { "Prensa 45°": [{ completed: true, weight: '100', reps: '12' }, ...] }
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(storageKey);
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  // La función de actualización ahora maneja cambios en el checkbox, peso o reps.
  const handleSetChange = (exerciseTitle, setIndex, field, value) => {
    const newProgress = JSON.parse(JSON.stringify(progress));

    // Si es la primera vez que interactuamos, creamos la estructura de datos.
    if (!newProgress[exerciseTitle]) {
      const numSets = parseInt(exercises
        .flatMap(group => group.list)
        .find(ex => ex.title === exerciseTitle)
        .reps) || 0;
      
      // Cada serie ahora es un objeto completo.
      newProgress[exerciseTitle] = Array(numSets).fill({
        completed: false,
        weight: '',
        reps: ''
      });
    }

    // Actualizamos el campo específico (completed, weight, o reps) del set específico.
    newProgress[exerciseTitle][setIndex] = {
        ...newProgress[exerciseTitle][setIndex],
        [field]: value
    };

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
                  // Le pasamos el array de objetos de series para este ejercicio.
                  setsData={progress[ex.title] || []}
                  // Le pasamos la función de actualización.
                  onSetChange={(setIndex, field, value) => handleSetChange(ex.title, setIndex, field, value)}
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