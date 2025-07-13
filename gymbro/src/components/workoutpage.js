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
  
  return (
    <>
      <Header />
      <h2 className="section-title">Tu Semana</h2>
      {workoutPlan.trainingDays.map(dayData => (
        <DaySection
          key={dayData.day}
          day={dayData.day}
          title={dayData.title}
          theme={dayData.theme}
          exercises={dayData.exercises}
        />
      ))}
    </>
  );
};

export default WorkoutPage;