import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registramos los componentes de Chart.js que vamos a usar.
// Esto es necesario para que Chart.js sepa qué elementos dibujar.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  // --- ESTADOS DEL COMPONENTE ---
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseChartData, setExerciseChartData] = useState({ datasets: [] });
  const [weightLog, setWeightLog] = useState([]);

  // --- EFECTO PARA CARGAR TODOS LOS DATOS DESDE LOCALSTORAGE AL INICIAR ---
  useEffect(() => {
    // 1. Cargar datos de progreso de ejercicios
    const allProgress = {};
    const exerciseSet = new Set();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('progress-')) {
        const dayData = JSON.parse(localStorage.getItem(key));
        for (const exerciseTitle in dayData) {
          if (!allProgress[exerciseTitle]) {
            allProgress[exerciseTitle] = [];
          }
          exerciseSet.add(exerciseTitle);
          allProgress[exerciseTitle].push(...dayData[exerciseTitle]);
        }
      }
    }
    setExerciseProgress(allProgress);
    setAvailableExercises(Array.from(exerciseSet));

    // 2. Cargar datos de peso corporal
    const savedWeightLog = JSON.parse(localStorage.getItem('bodyWeightLog')) || [];
    setWeightLog(savedWeightLog);
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez.

  // --- EFECTO PARA ACTUALIZAR EL GRÁFICO CUANDO CAMBIA EL EJERCICIO SELECCIONADO ---
  useEffect(() => {
    if (selectedExercise && exerciseProgress[selectedExercise]) {
      const progressForExercise = exerciseProgress[selectedExercise];
      
      const maxWeights = progressForExercise
        .filter(set => set.completed && set.weight)
        .map(set => parseFloat(set.weight));

      setExerciseChartData({
        labels: maxWeights.map((_, index) => `Sesión ${index + 1}`),
        datasets: [{
          label: `Peso Máx. en ${selectedExercise} (kg)`,
          data: maxWeights,
          borderColor: 'rgb(116, 185, 255)',
          backgroundColor: 'rgba(116, 185, 255, 0.5)',
          tension: 0.1
        }]
      });
    }
  }, [selectedExercise, exerciseProgress]); // Se ejecuta cada vez que estas variables cambian.

  // --- DATOS Y OPCIONES PARA LOS GRÁFICOS ---
  const weightChartData = {
    labels: weightLog.map(log => log.date),
    datasets: [{
      label: 'Peso Corporal (kg)',
      data: weightLog.map(log => log.weight),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }]
  };
  
  const chartOptions = (text) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f0' } },
      title: { display: true, text, color: '#f0f0f0', font: { size: 18 } },
    },
    scales: {
      y: { ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(240, 240, 240, 0.1)' } },
      x: { ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(240, 240, 240, 0.1)' } }
    }
  });

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Tu Progreso</h2>
      
      {/* CARD PARA EL GRÁFICO DE EVOLUCIÓN DE FUERZA */}
      <div className="chart-card">
        <h3>Evolución de Fuerza</h3>
        <select className="exercise-select" value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
          <option value="">Selecciona un ejercicio...</option>
          {availableExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        </select>
        {selectedExercise ? (
          <Line options={chartOptions('Progreso de Fuerza')} data={exerciseChartData} />
        ) : <p className="chart-placeholder">Elige un ejercicio para ver tu progreso.</p>}
      </div>

      {/* CARD PARA EL GRÁFICO DE EVOLUCIÓN DEL PESO CORPORAL */}
      <div className="chart-card">
        <h3>Evolución del Peso Corporal</h3>
        {weightLog.length > 0 ? (
          <Line options={chartOptions('Progreso de Peso Corporal')} data={weightChartData} />
        ) : (
          <p className="chart-placeholder">
            Aún no hay registros de peso. ¡Agrega el primero desde el botón de la barra de navegación!
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;