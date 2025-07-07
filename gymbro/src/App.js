import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Importamos los componentes
import Navbar from './components/navbar';
import WorkoutPage from './components/workoutpage';
import DashboardPage from './components/dashboardpage';
import Modal from './components/modal'; // Importamos el Modal
import WeightLogForm from './components/weightloform'; // Importamos el nuevo formulario

function App() {
  // Estado para controlar la visibilidad del modal de peso
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  // Función para guardar el peso en localStorage
  const handleSaveWeight = (newWeight) => {
    const savedWeightLog = JSON.parse(localStorage.getItem('bodyWeightLog')) || [];
    const today = new Date().toLocaleDateString('es-AR');
    const newLog = [...savedWeightLog, { date: today, weight: newWeight }];
    localStorage.setItem('bodyWeightLog', JSON.stringify(newLog));
    setIsWeightModalOpen(false); // Cerramos el modal después de guardar
  };

  return (
    <>
      <div className="container">
        {/* Le pasamos la función para abrir el modal al Navbar */}
        <Navbar onLogWeightClick={() => setIsWeightModalOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<WorkoutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>

      {/* El modal ahora vive aquí, a nivel de App, para mostrarse sobre todo */}
      <Modal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)}>
        <WeightLogForm onSave={handleSaveWeight} />
      </Modal>
    </>
  );
}

export default App;