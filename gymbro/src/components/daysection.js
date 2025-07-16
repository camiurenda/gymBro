import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import ExerciseCard from './excersicecard';
import Modal from './modal';
import FeedbackModal from './feedbackmodal'; // Importar el nuevo modal

const DaySection = ({ day, title, theme, exercises, isToday = false }) => {
  const { currentUser } = useAuth();
  
  // El estado del progreso se inicializa vacío. Se cargará desde Firestore.
  const [progress, setProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');


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


  const handleSetChange = (exerciseTitle, setIndex, field, value) => {
    if (!currentUser) return;

    const newProgress = JSON.parse(JSON.stringify(progress));

    if (!newProgress[exerciseTitle]) {
      const numSets = parseInt(exercises.flatMap(g => g.list).find(e => e.title === exerciseTitle).reps) || 0;
      newProgress[exerciseTitle] = Array(numSets).fill({ completed: false, weight: '', reps: '' });
    }

    newProgress[exerciseTitle][setIndex] = {
      ...newProgress[exerciseTitle][setIndex],
      [field]: value
    };

    setProgress(newProgress);
  };

  const handleSaveProgress = async (exerciseTitle) => {
    if (!currentUser || !progress[exerciseTitle]) return;

    const progressToSave = {
      [exerciseTitle]: progress[exerciseTitle]
    };

    const progressRef = doc(db, "userProgress", `${currentUser.uid}-${day}`);
    await setDoc(progressRef, progressToSave, { merge: true });
    
    if (!completedExercises.includes(exerciseTitle)) {
      setCompletedExercises([...completedExercises, exerciseTitle]);
    }

    // --- Lógica de Hito de PR ---
    const currentSets = progress[exerciseTitle];
    const currentMaxWeight = Math.max(...currentSets.map(s => parseFloat(s.weight) || 0));

    const userProgressCollection = collection(db, "userProgress");
    const querySnapshot = await getDocs(userProgressCollection);
    let previousMaxWeight = 0;

    querySnapshot.forEach(doc => {
      if (doc.id.startsWith(currentUser.uid)) {
        const data = doc.data();
        if (data[exerciseTitle]) {
          // Exclude the current day's progress from the check
          if (doc.id !== `${currentUser.uid}-${day}`) {
            const maxWeightInDoc = Math.max(...data[exerciseTitle].map(s => parseFloat(s.weight) || 0));
            if (maxWeightInDoc > previousMaxWeight) {
              previousMaxWeight = maxWeightInDoc;
            }
          }
        }
      }
    });

    if (currentMaxWeight > previousMaxWeight) {
      await addDoc(collection(db, "timelineEvents"), {
        userId: currentUser.uid,
        date: serverTimestamp(),
        type: 'auto_pr',
        title: '¡Nuevo Récord Personal!',
        description: `Alcanzaste ${currentMaxWeight}kg en ${exerciseTitle}`,
        icon: '🏆',
        imageUrl: '',
        createdAt: serverTimestamp(),
      });
    }
    // --- Fin de Lógica de Hito de PR ---

    alert(`Progreso de "${exerciseTitle}" guardado!`);
  };

  const handleAIFeedback = async ({ hardestExercise, feeling }) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const { displayName } = currentUser;
    
    const progressSummary = completedExercises.map(exTitle => {
      return {
        exercise: exTitle,
        sets: progress[exTitle]
      };
    });

    const prompt = `
      Eres un coach de fitness virtual llamado 'Gemini Coach', eres positivo, empático y motivador. Un usuario acaba de terminar su rutina. Aquí están sus datos:

      - Nombre de usuario: ${displayName}
      - Día de entrenamiento: ${day} - ${title}
      - Progreso de hoy: ${JSON.stringify(progressSummary, null, 2)}
      - El ejercicio que más le costó: ${hardestExercise}
      - Cómo se sintió: ${feeling}

      Tu tarea es escribir una respuesta breve (máximo 4 o 5 frases) pero significativa que cumpla con lo siguiente:
      1. Valida su sentimiento (ej: 'Es normal sentirse así después de darlo todo').
      2. Felicítalo por su esfuerzo, especialmente mencionando el ejercicio que le costó.
      3. Dale un consejo práctico y motivador para la próxima vez que entrene.
      4. Termina con una frase muy positiva y alentadora.

      Mantén un tono cercano y amigable. La respuesta debe ser bonita y hacer que se sienta orgulloso/a de su trabajo.
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiFeedback(data.choices[0].message.content.trim());
      } else {
        setAiFeedback('No se pudo obtener una respuesta. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error fetching AI feedback:', error);
      setAiFeedback('Ocurrió un error al contactar a la IA. Revisa la consola.');
    }
  };
  
  // --- Lógica del Modal (no cambia) ---
  const openExerciseDetails = (exercise) => { /* ... */ };
  const closeExerciseDetails = () => { /* ... */ };

  if (loadingProgress) {
      return <h4>Cargando progreso del día...</h4>
  }

  return (
    <>
      <div className={`day-section ${theme} ${isToday ? 'today' : ''}`}>
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
                    isCompleted={completedExercises.includes(ex.title)}
                    setsData={progress[ex.title] || []}
                    onSetChange={(setIndex, field, value) => handleSetChange(ex.title, setIndex, field, value)}
                    onSave={() => handleSaveProgress(ex.title)}
                    onCardClick={() => openExerciseDetails(ex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="day-footer">
          <button 
            className="finalize-btn"
            disabled={completedExercises.length === 0}
            onClick={() => setFeedbackModalOpen(true)}
          >
            Finalizar y Obtener Feedback de IA
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeExerciseDetails}>
        {/* ... contenido del modal ... */}
      </Modal>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        completedExercises={completedExercises}
        onSubmit={handleAIFeedback}
        aiFeedback={aiFeedback}
      />
    </>
  );
};

export default DaySection;
