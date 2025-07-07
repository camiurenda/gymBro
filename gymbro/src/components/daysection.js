import React, { useState, useEffect } from 'react';
import ExerciseCard from './excersicecard';
import Modal from './modal'; // Importamos el componente Modal

const DaySection = ({ day, title, theme, exercises }) => {
  const storageKey = `progress-${day}`;
  
  // ESTADO DEL PROGRESO (CHECboxes, PESO, REPS)
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(storageKey);
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // ESTADO DEL MODAL (PARA VER DETALLES DEL EJERCICIO)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // EFECTO PARA GUARDAR EL PROGRESO EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);


  // --- FUNCIÓN PARA MANEJAR CAMBIOS EN EL PROGRESO (LA QUE FALTABA) ---
  const handleSetChange = (exerciseTitle, setIndex, field, value) => {
    const newProgress = JSON.parse(JSON.stringify(progress));

    if (!newProgress[exerciseTitle]) {
      const numSets = parseInt(exercises
        .flatMap(group => group.list)
        .find(ex => ex.title === exerciseTitle)
        .reps) || 0;
      
      newProgress[exerciseTitle] = Array(numSets).fill({
        completed: false,
        weight: '',
        reps: ''
      });
    }

    newProgress[exerciseTitle][setIndex] = {
        ...newProgress[exerciseTitle][setIndex],
        [field]: value
    };

    // AQUÍ VOLVEMOS A USAR setProgress, ARREGLANDO EL WARNING Y LA FUNCIONALIDAD
    setProgress(newProgress);
  };
  
  // --- FUNCIONES PARA CONTROLAR EL MODAL ---
  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const closeExerciseDetails = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <>
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
                    exerciseData={ex}
                    setsData={progress[ex.title] || []}
                    // VOLVEMOS A PASAR LAS DOS FUNCIONES COMO PROPS
                    onSetChange={(setIndex, field, value) => handleSetChange(ex.title, setIndex, field, value)}
                    onCardClick={() => openExerciseDetails(ex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeExerciseDetails}>
        {selectedExercise && (
          <div className="exercise-details-modal">
            <h2>{selectedExercise.title}</h2>
            <img src={selectedExercise.gifUrl} alt={`GIF animado de ${selectedExercise.title}`} className="exercise-gif" />
            <h3>Técnica Detallada</h3>
            <p>{selectedExercise.detailedTechnique}</p>
            <h3>Errores Comunes</h3>
            <p>{selectedExercise.commonMistakes}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DaySection;