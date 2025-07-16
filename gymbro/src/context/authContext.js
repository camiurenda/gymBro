import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { planCami, planNovia } from '../plans'; // ¡Importante! Usamos los planes desde el archivo central.

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determinar qué plan asignar basado en el email
    let planToAssign;
    if (email.toLowerCase() === 'urendacamila@gmail.com') {
      planToAssign = planCami;
    } else if (email.toLowerCase() === 'arq.luciamartinez@gmail.com') {
      planToAssign = planNovia;
    } else {
      // Opcional: un plan por defecto o manejar el caso de un usuario inesperado
      planToAssign = planNovia; // Por defecto, asignamos el plan de Lucia
    }

    const planRef = doc(db, "workoutPlans", user.uid);
    await setDoc(planRef, planToAssign); 

    return userCredential;
  }
  
  async function login(email, password) {
    await setPersistence(auth, browserLocalPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
