import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import ExerciseCard from './excersicecard';
import Modal from './modal';

const DaySection = ({ day, title, theme, exercises }) => {
  const { currentUser } = useAuth();
  
  // El estado del progreso se inicializa vacío. Se cargará desde Firestore.
  const [progress, setProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // ESTADO DEL MODAL (esto no cambia)
  const [isModalOpen] = useState(false);

  // --- LÓGICA DE FIRESTORE ---
  useEffect(() => {
    if (!currentUser || !day) return;

    const fetchProgress = async () => {
      // 1. Creamos una referencia al documento de progreso del usuario para este día específico.
      //    El ID será, por ejemplo, "ID_DEL_USUARIO-LUNES"
      const progressRef = doc(db, "userProgress", `${currentUser.uid}-${day}`);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        // 2. Si existe, lo cargamos en el estado.
        setProgress(progressSnap.data());
      } else {
        // Si no existe, el estado `progress` simplemente quedará como un objeto vacío {}.
        console.log(`No se encontró progreso para ${day}. Se creará al primer cambio.`);
      }
      setLoadingProgress(false);
    };

    fetchProgress();
  }, [currentUser, day]);


  const handleSetChange = async (exerciseTitle, setIndex, field, value) => {
    // No hacemos nada si el usuario no está logueado
    if (!currentUser) return;

    // 3. Creamos una copia del estado para trabajar
    const newProgress = JSON.parse(JSON.stringify(progress));

    // Si es la primera vez, inicializamos la estructura para ese ejercicio
    if (!newProgress[exerciseTitle]) {
      const numSets = parseInt(exercises.flatMap(g => g.list).find(e => e.title === exerciseTitle).reps) || 0;
      newProgress[exerciseTitle] = Array(numSets).fill({ completed: false, weight: '', reps: '' });
    }

    // Actualizamos el campo específico
    newProgress[exerciseTitle][setIndex] = {
      ...newProgress[exerciseTitle][setIndex],
      [field]: value
    };

    // Actualizamos el estado local para una respuesta instantánea en la UI
    setProgress(newProgress);

    // 4. GUARDAMOS EN FIRESTORE
    // Apuntamos al mismo documento y usamos `setDoc` con `merge: true`.
    // Esto es muy eficiente: solo actualiza los campos que cambiaron en el objeto,
    // en lugar de reescribir todo el documento.
    const progressRef = doc(db, "userProgress", `${currentUser.uid}-${day}`);
    await setDoc(progressRef, newProgress, { merge: true });
  };
  
  // --- Lógica del Modal (no cambia) ---
  const openExerciseDetails = (exercise) => { /* ... */ };
  const closeExerciseDetails = () => { /* ... */ };

  if (loadingProgress) {
      return <h4>Cargando progreso del día...</h4>
  }

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
        {/* ... contenido del modal ... */}
      </Modal>
    </>
  );
};

export default DaySection;
