import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseChartData, setExerciseChartData] = useState({ datasets: [] });
  const [weightLog, setWeightLog] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // --- LEER DATOS DESDE FIRESTORE ---
    const fetchData = async () => {
      // 1. Cargar datos de progreso de ejercicios
      const allProgress = {};
      const exerciseSet = new Set();
      
      // Creamos una consulta para traer TODOS los documentos de progreso de ESTE usuario
      const q = query(collection(db, "userProgress"), where("__name__", ">=", currentUser.uid), where("__name__", "<=", currentUser.uid + '\uf8ff'));
      const querySnapshot = await getDocs(q);

      const progressBySession = {};

      querySnapshot.forEach((doc) => {
        const docId = doc.id;
        const dayData = doc.data();
        
        // Extraemos la fecha del ID del documento para ordenar
        const parts = docId.split('-');
        const year = parseInt(parts[1], 10);
        const week = parseInt(parts[2], 10);
        // Asumimos que el día es el inicio de la semana para el orden
        const sessionDate = new Date(year, 0, 1 + (week - 1) * 7);

        progressBySession[docId] = {
          date: sessionDate,
          data: dayData
        };
      });

      // Ordenamos las sesiones por fecha
      const sortedSessions = Object.values(progressBySession).sort((a, b) => a.date - b.date);

      sortedSessions.forEach(session => {
        const { data } = session;
        for (const exerciseTitle in data) {
          // Ignoramos propiedades que no son de ejercicios
          if (exerciseTitle === 'completedExercises') continue;

          if (!allProgress[exerciseTitle]) {
            allProgress[exerciseTitle] = [];
          }
          exerciseSet.add(exerciseTitle);
          
          // Guardamos los datos de la sesión junto con la fecha
          allProgress[exerciseTitle].push({
            date: session.date,
            sets: data[exerciseTitle]
          });
        }
      });
      setExerciseProgress(allProgress);
      setAvailableExercises(Array.from(exerciseSet));

      // 2. Cargar datos de peso corporal
      const weightsQuery = query(
        collection(db, "weights"),
        where("userId", "==", currentUser.uid),
        orderBy("timestamp", "asc")
      );
      const weightsSnapshot = await getDocs(weightsQuery);
      const weightsData = weightsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convertir timestamp a un formato legible si es necesario
        date: doc.data().timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
      }));
      setWeightLog(weightsData);
    };

    fetchData();
  }, [currentUser]);
  
  // --- EFECTO PARA ACTUALIZAR EL GRÁFICO CUANDO CAMBIA EL EJERCICIO SELECCIONADO ---
  useEffect(() => {
    if (selectedExercise && exerciseProgress[selectedExercise]) {
      // 1. Obtenemos todas las sesiones para el ejercicio seleccionado.
      const sessionsForExercise = exerciseProgress[selectedExercise];

      // 2. Calculamos el peso máximo para CADA sesión.
      const maxWeightsPerSession = sessionsForExercise.map(session => {
        // Nos aseguramos de que 'session.sets' sea un array antes de usar 'map'.
        if (!Array.isArray(session.sets)) {
          return 0; // Si no hay 'sets', el peso máximo es 0.
        }
        // Calculamos el peso máximo de esta sesión específica.
        const weightsInSession = session.sets
          .map(set => parseFloat(set.weight) || 0); // Convertimos cada peso a número.
        return Math.max(...weightsInSession); // Devolvemos el más alto.
      });

      // 3. Creamos las etiquetas para el gráfico.
      const chartLabels = sessionsForExercise.map((_, index) => `Sesión ${index + 1}`);

      // 4. Actualizamos el estado del gráfico con los datos correctos.
      setExerciseChartData({
        labels: chartLabels,
        datasets: [{
          label: `Peso Máx. en ${selectedExercise} (kg)`,
          data: maxWeightsPerSession, // Usamos el array de pesos máximos por sesión.
          borderColor: 'rgb(116, 185, 255)',
          backgroundColor: 'rgba(116, 185, 255, 0.5)',
          tension: 0.1
        }]
      });
    }
  }, [selectedExercise, exerciseProgress]);

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
