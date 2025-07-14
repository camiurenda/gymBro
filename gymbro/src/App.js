// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

import './App.css';
import Navbar from './components/navbar';
import WorkoutPage from './components/workoutpage';
import DashboardPage from './components/dashboardpage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import Modal from './components/modal';
import WeightLogForm from './components/weightloform';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  // Agregamos una comprobación de 'loading' que viene del contexto
  if (useAuth().loading) {
    return <div className="auth-container"><h2>Cargando...</h2></div>;
  }
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const { currentUser } = useAuth();
  // 1. Devolvemos el estado para manejar el modal a App.js
  const [isWeightModalOpen, setWeightModalOpen] = useState(false);

  return (
    // Usamos un Fragment <> para poder tener el Modal fuera del .container
    <>
      <div className="container">
        {/* 2. Le pasamos la función para abrir el modal al Navbar */}
        {currentUser && <Navbar onLogWeightClick={() => setWeightModalOpen(true)} />}
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <WorkoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>

      {/* 3. El Modal vive aquí, a nivel global, y se muestra cuando el estado es true */}
      {currentUser && (
         <Modal isOpen={isWeightModalOpen} onClose={() => setWeightModalOpen(false)}>
            <WeightLogForm 
                userId={currentUser.uid} 
                onClose={() => setWeightModalOpen(false)} 
            />
         </Modal>
      )}
    </>
  );
}

export default App;