import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { planCami } from '../plans'; // ¡Importante! Usamos tu plan desde el archivo central.

import Header from './header';
import DaySection from './daysection';

const WorkoutPage = () => {
  const { currentUser } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Nuevo estado para la rutina seleccionada

  // Esta función es para tu botón temporal.
  const handleAssignMyPlan = async () => {
    if (!currentUser) return;
    const planRef = doc(db, "workoutPlans", currentUser.uid);
    // Usa el plan importado para guardarlo en tu documento.
    await setDoc(planRef, planCami);
    alert("¡Tu plan fue asignado! La página se recargará.");
    window.location.reload();
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    };

    const fetchWorkoutPlan = async () => {
      setLoading(true);
      const planRef = doc(db, 'workoutPlans', currentUser.uid);
      const planSnap = await getDoc(planRef);
      if (planSnap.exists()) {
        setWorkoutPlan(planSnap.data());
      } else {
        console.log("No se encontró plan, mostrando botón de asignación.");
      }
      setLoading(false);
    };

    fetchWorkoutPlan();
  }, [currentUser]);

  if (loading) {
    return <div className="auth-container"><h2>Cargando tu plan...</h2></div>;
  }

  if (!workoutPlan) {
    return (
      <div className="auth-container">
        <h2>¡Hola!</h2>
        <p>Parece que no tenés un plan de entrenamiento asignado.</p>
        <button className="save-button" style={{marginTop: '20px'}} onClick={handleAssignMyPlan}>
          Asignarme mi Plan Original
        </button>
      </div>
    );
  }

  // Si hay una rutina seleccionada, la mostramos
  if (selectedWorkout) {
    return (
      <>
        <Header />
        <div className="workout-view">
          <button className="collapse-button" onClick={() => setSelectedWorkout(null)}>
            Elegir otra rutina
          </button>
          <DaySection
            key={selectedWorkout.day}
            day={selectedWorkout.day}
            title={selectedWorkout.title}
            theme={selectedWorkout.theme}
            exercises={selectedWorkout.exercises}
            isToday={true}
          />
        </div>
      </>
    );
  }

  // Si no hay rutina seleccionada, mostramos la pantalla de selección
  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="section-title">¿Qué rutina querés hacer hoy?</h2>
        <div className="other-days-grid">
          {workoutPlan.trainingDays.map(dayData => (
            <div className="day-card" key={dayData.day} onClick={() => setSelectedWorkout(dayData)}>
              <DaySection
                day={dayData.day}
                title={dayData.title}
                theme={dayData.theme}
                exercises={dayData.exercises}
                isSelectable={true} // Prop para modo "tarjeta"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkoutPage;
