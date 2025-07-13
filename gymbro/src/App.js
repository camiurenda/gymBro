import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';


import './App.css';
import Navbar from './components/navbar';
import WorkoutPage from './components/workoutpage';
import DashboardPage from './components/dashboardpage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';


function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Muestra un spinner o un mensaje de carga mientras se verifica el estado de autenticación
    return <div>Cargando...</div>;
  }

  if (!currentUser) {
    // Si no hay usuario, redirige a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay un usuario, renderiza el componente hijo (la ruta protegida)
  return children;
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
