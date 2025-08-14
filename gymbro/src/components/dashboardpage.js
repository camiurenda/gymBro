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
        
        // Usamos el timestamp si existe, si no, calculamos la fecha como antes.
        let sessionDate;
        if (dayData.createdAt && dayData.createdAt.toDate) {
          sessionDate = dayData.createdAt.toDate();
        } else {
          // Fallback para datos antiguos sin timestamp
          const parts = docId.split('-');
          const year = parseInt(parts[1], 10);
          const week = parseInt(parts[2], 10);
          sessionDate = new Date(year, 0, 1 + (week - 1) * 7);
        }

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
      const sessionsForExercise = exerciseProgress[selectedExercise];

      // 2. Calculamos un objeto con toda la info del PR de CADA sesión.
      const recordsPerSession = sessionsForExercise.map(session => {
        if (!Array.isArray(session.sets) || session.sets.length === 0) {
          return { weight: 0, reps: 0, date: session.date };
        }

        // Encontramos el set con el peso máximo en la sesión.
        const recordSet = session.sets.reduce((max, current) => {
          const maxWeight = parseFloat(max.weight) || 0;
          const currentWeight = parseFloat(current.weight) || 0;
          return currentWeight > maxWeight ? current : max;
        });
        
        return {
          weight: parseFloat(recordSet.weight) || 0,
          reps: parseInt(recordSet.reps, 10) || 0,
          date: session.date
        };
      });

      // 3. Creamos las etiquetas (fechas) y los datos (pesos) para el gráfico.
      const chartLabels = recordsPerSession.map(r => r.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
      const chartData = recordsPerSession.map(r => r.weight);
      
      // Guardamos los datos completos para usarlos en los tooltips.
      const fullData = recordsPerSession;

      // 4. Actualizamos el estado del gráfico.
      setExerciseChartData({
        labels: chartLabels,
        datasets: [{
          label: `Peso Máx. en ${selectedExercise} (kg)`,
          data: chartData,
          fullData: fullData, // Propiedad personalizada para el tooltip
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
      tooltip: {
        callbacks: {
          // Personalizamos el tooltip para mostrar las repeticiones.
          footer: function(tooltipItems) {
            const item = tooltipItems[0];
            const fullData = item.dataset.fullData; // Accedemos a nuestros datos completos.
            const record = fullData[item.dataIndex];
            if (record && record.reps > 0) {
              return `Repeticiones: ${record.reps}`;
            }
            return '';
          }
        }
      }
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
