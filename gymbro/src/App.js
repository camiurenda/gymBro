// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Importamos los componentes y las nuevas páginas
import Navbar from './components/navbar';
import WorkoutPage from './components/workoutpage';
import DashboardPage from './components/dashboardpage'; // Lo crearemos en el siguiente paso

function App() {
  return (
    <div className="container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<WorkoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Descomentar */}
        </Routes>
      </main>
    </div>
  );
}

export default App;