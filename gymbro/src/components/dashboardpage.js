// src/DashboardPage.js

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

// Registramos los componentes de Chart.js que vamos a usar
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
  // Lógica para leer y procesar los datos... (esto es complejo, lo haremos en un paso futuro)
  
  // Por ahora, usamos datos de ejemplo para asegurarnos de que el gráfico se renderiza
  const chartData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Peso Levantado en Prensa 45° (kg)',
        data: [100, 105, 110, 115],
        borderColor: 'rgb(116, 185, 255)',
        backgroundColor: 'rgba(116, 185, 255, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución de Fuerza',
        color: '#f0f0f0',
        font: { size: 18 }
      },
    },
    scales: {
      y: {
        ticks: { color: '#f0f0f0' },
        grid: { color: 'rgba(240, 240, 240, 0.1)' }
      },
      x: {
        ticks: { color: '#f0f0f0' },
        grid: { color: 'rgba(240, 240, 240, 0.1)' }
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="section-title">Tu Progreso</h2>
      <div style={{ backgroundColor: '#2c2c2c', padding: '20px', borderRadius: '15px' }}>
         <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default DashboardPage;