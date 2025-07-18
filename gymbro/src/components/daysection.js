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
  const [editingExercise, setEditingExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


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
        const data = progressSnap.data();
        // 2. Si existe, lo cargamos en el estado.
        setProgress(data);
        if (data.completedExercises) {
          setCompletedExercises(data.completedExercises);
        }
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

    const newCompletedExercises = [...completedExercises];
    if (!newCompletedExercises.includes(exerciseTitle)) {
      newCompletedExercises.push(exerciseTitle);
    }

    const progressToSave = {
      ...progress,
      completedExercises: newCompletedExercises
    };

    const progressRef = doc(db, "userProgress", `${currentUser.uid}-${day}`);
    await setDoc(progressRef, progressToSave, { merge: true });
    
    setCompletedExercises(newCompletedExercises);
    setEditingExercise(null); // Finaliza la edición al guardar

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

  const handleEditClick = (exerciseTitle) => {
    setEditingExercise(exerciseTitle);
  };

  const handleAIFeedback = async ({ hardestExercise, feeling }) => {
    setIsLoading(true);
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const { displayName, email } = currentUser;
    
    const progressSummary = completedExercises.map(exTitle => {
      return {
        exercise: exTitle,
        sets: progress[exTitle]
      };
    });

    let userSpecificContext = "";
    if (email.toLowerCase() === 'urendacamila@gmail.com') {
      userSpecificContext = "La usuaria es Cami. Trátala con un tono cómplice y cercano, ¡como si fueras su compañera de gym!";
    } else if (email.toLowerCase() === 'arq.luciamartinez@gmail.com') {
      userSpecificContext = "La usuaria es Lucía. Valora el progreso y la estructura. Sé especialmente alentadora y enfocada en sus logros.";
    }

    const prompt = `
      Quiero que actúes como un asistente virtual de gimnasio con un enfoque emocional y motivacional.
      Tu estilo debe ser cálido, cercano, sin juicios, y realista. Hablá como una entrenadora o entrenador que conoce el esfuerzo personal detrás de cada entrenamiento y que sabe que la constancia vale más que la perfección.

      ¿Cómo quiero que me hables?
      - Con empatía: validá mis emociones y desafíos.
      - Con motivación real: no uses frases cliché vacías, sino que resaltá mis progresos aunque parezcan mínimos.
      - Usá ejemplos cotidianos, hacelo humano, incluso con un toque de humor si corresponde.
      - No critiques si no logro todo; ayudame a encontrar el lado positivo y a ajustar.
      - Celebrá cuando hago algo bien, aunque sea simplemente haber ido al gym.
      - Si te cuento cosas personales o detalles del día a día, respondé como alguien que realmente escucha.

      Tu tarea es acompañarme en mi camino de entrenamiento físico, emocional y de hábitos.
      Ayudame a mantener la constancia, a ver mis logros y a construir una relación sana con el ejercicio y conmigo misma/mismo.
      Este estilo debe mantenerse en cada respuesta, ya sea que te hable sobre una rutina, una queja, una duda, o una victoria pequeña.

      ---
      Aquí están los datos del usuario y su entrenamiento de hoy:

      > Información del usuario:
      - Nombre: ${displayName}
      - Contexto Adicional para la IA: ${userSpecificContext}
      - Objetivo general: [Aún no disponible]
      - Nivel actual: [Aún no disponible]
      - Frecuencia de entrenamiento: [Aún no disponible]
      - Rutina preferida: [Aún no disponible]
      - Dificultades comunes: [Aún no disponible]

      > Feedback de hoy:
      - Día de entrenamiento: ${day} - ${title}
      - Progreso de hoy: ${JSON.stringify(progressSummary, null, 2)}
      - El ejercicio que más le costó: ${hardestExercise}
      - Cómo se sintió al terminar: ${feeling}

      Ahora, generá una respuesta que siga todas las indicaciones de estilo y que se base en el feedback de hoy, teniendo MUY en cuenta el "Contexto Adicional".
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- Lógica del Modal (no cambia) ---
  const openExerciseDetails = (exercise) => { /* ... */ };
  const closeExerciseDetails = () => { /* ... */ };

  if (loadingProgress) {
      return <h4>Cargando progreso del día...</h4>
  }

  const pendingExercises = exercises.map(group => ({
    ...group,
    list: group.list.filter(ex => !completedExercises.includes(ex.title))
  })).filter(group => group.list.length > 0);

  const completedExercisesList = exercises.map(group => ({
    ...group,
    list: group.list.filter(ex => completedExercises.includes(ex.title))
  })).filter(group => group.list.length > 0);

  return (
    <>
      <div className={`day-section ${theme} ${isToday ? 'today' : ''}`}>
        <div className={`day-header ${theme}`}>{day} - {title}</div>
        <div className="day-content">
          {pendingExercises.map(group => (
            <div key={group.groupName} className="muscle-group">
              <h4>{group.groupName}</h4>
              <div className="exercise-grid">
                {group.list.map(ex => (
                  <ExerciseCard
                    key={ex.title}
                    exerciseData={ex}
                    isCompleted={false}
                    isEditing={editingExercise === ex.title}
                    setsData={progress[ex.title] || []}
                    onSetChange={(setIndex, field, value) => handleSetChange(ex.title, setIndex, field, value)}
                    onSave={() => handleSaveProgress(ex.title)}
                    onCardClick={() => openExerciseDetails(ex)}
                    onEditClick={() => handleEditClick(ex.title)}
                  />
                ))}
              </div>
            </div>
          ))}

          {completedExercisesList.length > 0 && (
            <div className="completed-section">
              <h4 className="completed-title">Completados</h4>
              {completedExercisesList.map(group => (
                <div key={group.groupName} className="muscle-group">
                  <h4>{group.groupName}</h4>
                  <div className="exercise-grid">
                    {group.list.map(ex => (
                      <ExerciseCard
                        key={ex.title}
                        exerciseData={ex}
                        isCompleted={true}
                        isEditing={editingExercise === ex.title}
                        setsData={progress[ex.title] || []}
                        onSetChange={(setIndex, field, value) => handleSetChange(ex.title, setIndex, field, value)}
                        onSave={() => handleSaveProgress(ex.title)}
                        onCardClick={() => openExerciseDetails(ex)}
                        onEditClick={() => handleEditClick(ex.title)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
        isLoading={isLoading}
      />
    </>
  );
};

export default DaySection;
