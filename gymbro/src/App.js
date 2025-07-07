import React from 'react';
import './App.css'; // Importaremos los estilos aquí

// Importamos los componentes que vamos a crear
import Header from './components/header';
import TimeInfo from './components/timeInfo';
import MobilitySection from './components/mobilitysection';
import DaySection from './components/daysection';
import ProgressionTable from './components/progressiontable';
import TipsSection from './components/tipssection';

// Datos de los días de entrenamiento (para hacerlo más dinámico)
const trainingDays = [
  {
    day: 'LUNES',
    title: 'Piernas/Glúteos',
    theme: 'lunes',
    exercises: [
      {
        groupName: 'Piernas y Glúteos',
        list: [
          { title: "Sillón de Cuádriceps", details: "Máquina: Extensión de piernas sentada. No bloquear rodillas, movimiento lento.", muscles: "Cuádriceps", reps: "3 series x 12 reps" },
          { title: "Camilla de Isquio", details: "Máquina: Curl femoral boca abajo. Movimiento lento, sin rebotes.", muscles: "Isquiotibiales", reps: "3 series x 12 reps" },
          { title: "Prensa 45°", details: "Máquina: Prensa de piernas inclinada. No despegar glúteos, control total.", muscles: "Glúteos, cuádriceps, isquios", reps: "3 series x 12 reps" },
          { title: "Aducción en Sillón", details: "Máquina: Juntador de piernas. Movimiento controlado.", muscles: "Aductores (parte interna)", reps: "3 series x 12 reps" },
          { title: "Subida al Cajón", details: "Material: Banco/cajón alto. Control total, no impulso.", muscles: "Glúteos, cuádriceps, core", reps: "3 series x 12 reps" },
          { title: "Estocada Dinámica", details: "Material: Mancuernas o barra. Paso largo, espalda recta.", muscles: "Glúteos, cuádriceps, isquios, core", reps: "3 series x 12 reps" },
        ]
      }
    ]
  },
  {
    day: 'MARTES',
    title: 'Piernas + Tren Superior',
    theme: 'martes',
    exercises: [
      {
        groupName: 'Piernas',
        list: [
          { title: "Peso Muerto", details: "Material: Mancuernas o barra. Espalda recta SIEMPRE, glúteos hacia atrás.", muscles: "Glúteos, isquios, espalda baja", reps: "3 series x 12 reps" },
          { title: "Sentadilla con Banda + Carga", details: "Material: Banda en rodillas + peso. Bajar hasta 90° o más, control total.", muscles: "Cuádriceps, glúteos, isquios, core", reps: "3 series x 12 reps" },
          { title: "Empuje de Caderas (Hip Thrust)", details: "Material: Banco + barra. Foco en glúteos, no arquear espalda.", muscles: "Glúteos, isquios, core", reps: "3 series x 12 reps" },
        ]
      },
      {
        groupName: 'Tren Superior',
        list: [
          { title: "Press Plano Barra", details: "Material: Banco plano + barra. No rebotes, bajada controlada.", muscles: "Pectorales, hombros, tríceps", reps: "3 series x 12 reps" },
          { title: "Vuelo Frontal", details: "Material: Mancuernas. Sin balanceo, movimiento controlado.", muscles: "Deltoides anterior", reps: "3 series x 12 reps" },
          { title: "Tríceps Polea", details: "Material: Polea alta. Codos fijos, no balancear cuerpo.", muscles: "Tríceps", reps: "3 series x 12 reps" },
          { title: "Bíceps + Press Militar (Biserie)", details: "Material: Mancuernas o barra. Control, sin balancear.", muscles: "Bíceps y deltoides", reps: "3 series x 12 reps" },
        ]
      }
    ]
  },
  {
    day: 'MIÉRCOLES',
    title: 'Piernas + Tren Superior',
    theme: 'miercoles',
    exercises: [
        {
            groupName: 'Piernas',
            list: [
                { title: "Camilla Isquio Monopodal", details: "Material: Camilla curl femoral. Una pierna a la vez.", muscles: "Isquiotibiales", reps: "3 series x 12 reps" },
                { title: "Vitalización con Rusa", details: "Material: Pesa rusa (kettlebell). Peso muerto + sentadilla.", muscles: "Glúteos, isquios, core", reps: "3 series x 12 reps" },
                { title: "Patada de Glúteos", details: "Material: Polea o banco. Pierna flexionada, empuje hacia atrás.", muscles: "Glúteos", reps: "3 series x 12 reps" },
                { title: "Estocada Combinada con Sentadilla", details: "Material: Peso corporal o mancuernas. Alternancia estocada-sentadilla.", muscles: "Glúteos, cuádriceps, core", reps: "3 series x 12 reps" },
            ]
        },
        {
            groupName: 'Tren Superior',
            list: [
                { title: "Jalón en Polea", details: "Material: Polea alta, agarre amplio. Espalda recta, pecho erguido.", muscles: "Dorsales, bíceps", reps: "3 series x 12 reps" },
                { title: "Vuelo Lateral", details: "Material: Mancuernas. Elevación lateral de brazos.", muscles: "Deltoides laterales", reps: "3 series x 12 reps" },
                { title: "Tríceps Fondo en Banco", details: "Material: Banco. Manos en banco, flexión de codos.", muscles: "Tríceps", reps: "3 series x 12 reps" },
            ]
        }
    ]
  },
  {
    day: 'JUEVES',
    title: 'Fuerza Total',
    theme: 'jueves',
    exercises: [
      {
        groupName: 'Rutina Completa',
        list: [
          { title: "Sillón Cuádriceps Monopodal y Doble", details: "Técnica: Primero una pierna, luego ambas.", muscles: "Cuádriceps", reps: "3 series x 12 reps" },
          { title: "Empuje de Cadera", details: "Técnica: Igual que martes.", muscles: "Glúteos, isquios", reps: "3 series x 12 reps" },
          { title: "Twist en Colchoneta", details: "Técnica: Giro de tronco tocando el suelo.", muscles: "Abdominales oblicuos", reps: "3 series x 12 reps" },
          { title: "Press Militar", details: "Técnica: Empuje sobre la cabeza.", muscles: "Hombros, tríceps", reps: "3 series x 12 reps" },
          { title: "Remo 90°", details: "Técnica: Flexión de cadera, tirón hacia abdomen.", muscles: "Dorsales, romboides, bíceps", reps: "3 series x 12 reps" },
          { title: "Bíceps (Curl)", details: "Técnica: Flexión de codos controlada.", muscles: "Bíceps", reps: "3 series x 12 reps" },
          { title: "Tríceps Sobre Cabeza", details: "Técnica: Extensión con mancuerna o polea.", muscles: "Tríceps", reps: "3 series x 12 reps" },
        ]
      }
    ]
  }
];

const dayMap = {
  1: 'LUNES',
  2: 'MARTES',
  3: 'MIÉRCOLES',
  4: 'JUEVES',
  5: 'VIERNES',
  6: 'SÁBADO',
  0: 'DOMINGO'
};

// 2. Obtenemos el día de hoy.
const today = new Date();
const currentDayName = dayMap[today.getDay()];

// 3. Buscamos el entrenamiento de hoy en nuestro array.
const todaysWorkout = trainingDays.find(day => day.day === currentDayName);

// 4. Creamos una lista con los otros entrenamientos.
const otherWorkouts = trainingDays.filter(day => day.day !== currentDayName);


// --- COMPONENTE PRINCIPAL APP ---

function App() {
  return (
    <div className="container">
      <Header />

      {/* --- SECCIÓN PRINCIPAL: Muestra el plan de hoy o un mensaje de descanso --- */}
      <div className="todays-focus">
        {todaysWorkout ? (
          // Si hay entrenamiento para hoy, lo mostramos con el componente DaySection
          <div>
            <h2 className="section-title">¡Plan para hoy, {currentDayName}!</h2>
            <DaySection
              key={todaysWorkout.day}
              day={todaysWorkout.day}
              title={todaysWorkout.title}
              theme={todaysWorkout.theme}
              exercises={todaysWorkout.exercises}
            />
          </div>
        ) : (
          // Si no hay entrenamiento, mostramos un mensaje de descanso
          <div className="rest-day-card">
            <h2 className="section-title">¡Hoy es {currentDayName}!</h2>
            <p>Día de descanso. ¡Aprovechá para recuperar energías!</p>
          </div>
        )}
      </div>


      {/* --- OTRAS SECCIONES --- */}

      <h2 className="section-title">Próximos Entrenamientos</h2>
      {otherWorkouts.map(dayData => (
        <DaySection
          key={dayData.day}
          day={dayData.day}
          title={dayData.title}
          theme={dayData.theme}
          exercises={dayData.exercises}
        />
      ))}

      <TimeInfo />
      <MobilitySection />
      <ProgressionTable />
      <TipsSection />
    </div>
  );
}

export default App;