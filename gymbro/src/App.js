// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import './App.css';

// Importamos componentes y páginas
import Navbar from './components/navbar';
import WorkoutPage from './components/workoutpage';
import DashboardPage from './components/dashboardpage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';

// Un componente especial para proteger rutas
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="container">
      {/* Mostramos la Navbar solo si hay un usuario conectado */}
      {currentUser && <Navbar />} 
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas Protegidas */}
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
  );
}

export default App;