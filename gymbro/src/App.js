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
          { 
            title: "Sillón de Cuádriceps", 
            details: "Máquina: Extensión de piernas sentada. No bloquear rodillas, movimiento lento.", 
            muscles: "Cuádriceps", 
            reps: "3 series x 12 reps",
            gifUrl:'https://media1.tenor.com/m/bqKtsSuqilQAAAAC/gym.gif', 
            detailedTechnique: "Siéntate en la máquina con la espalda completamente apoyada. Ajusta el respaldo y la almohadilla para que quede sobre tus tobillos. Extiende las piernas de forma controlada hasta casi la extensión completa (sin bloquear las rodillas). Baja lentamente controlando el peso.",
            commonMistakes: "No bloquear completamente las rodillas en la extensión. Evitar movimientos bruscos o usar impulso. No dejar que el peso caiga bruscamente al bajar."
          },
          { 
            title: "Camilla de Isquio", 
            details: "Máquina: Curl femoral boca abajo. Movimiento lento, sin rebotes.", 
            muscles: "Isquiotibiales", 
            reps: "3 series x 12 reps",
            gifUrl:'https://media1.tenor.com/m/fj_cZPprAyMAAAAC/gym.gif',
            detailedTechnique: "Acuéstate boca abajo en la camilla con las rodillas alineadas con el eje de rotación de la máquina. Coloca los tobillos bajo la almohadilla. Flexiona las rodillas llevando los talones hacia los glúteos de forma controlada. Baja lentamente hasta la posición inicial.",
            commonMistakes: "No levantar las caderas de la camilla durante el movimiento. Evitar los rebotes al final del recorrido. No usar todo el rango de movimiento disponible."
          },
          { 
            title: "Prensa 45°",  
            details: "No despegar glúteos, control total", 
            muscles: "Glúteos, cuádriceps, isquios", 
            reps: "3 series x 12 reps",
            gifUrl:'https://media1.tenor.com/m/yBaS_oBgidsAAAAd/gym.gif',
            detailedTechnique: "Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma hasta que las piernas estén casi extendidas (sin bloquear las rodillas). Baja de forma controlada hasta formar un ángulo de 90 grados o hasta donde tu flexibilidad te permita.",
            commonMistakes: "No dejes que la zona lumbar se despegue del asiento. Evita los rebotes al final del movimiento. No colocar los pies muy arriba o muy abajo en la plataforma."
          },
          { 
            title: "Aducción en Sillón", 
            details: "Máquina: Juntador de piernas. Movimiento controlado.", 
            muscles: "Aductores (parte interna)", 
            reps: "3 series x 12 reps",
            gifUrl:'https://media1.tenor.com/m/N62v0esa3K8AAAAC/innerouter-thigh-machine.gif',
            detailedTechnique: "Siéntate en la máquina con la espalda bien apoyada. Coloca las piernas contra las almohadillas en la posición más amplia cómoda. Junta las piernas de forma controlada contrayendo los aductores. Regresa lentamente a la posición inicial manteniendo la tensión.",
            commonMistakes: "No usar un rango excesivo que cause dolor. Evitar movimientos bruscos o usar impulso. No relajar completamente los músculos en la posición inicial."
          },
          { 
            title: "Subida al Cajón", 
            details: "Material: Banco/cajón alto. Control total, no impulso.", 
            muscles: "Glúteos, cuádriceps, core", 
            reps: "3 series x 12 reps",
            gifUrl:'https://gymvisual.com/img/p/3/6/7/0/7/36707.gif',
            detailedTechnique: "Colócate frente a un banco o cajón de altura apropiada (rodilla a 90° al subir). Sube completamente con una pierna, llevando la rodilla contraria hacia arriba. Baja de forma controlada con la misma pierna que subiste. Alterna las piernas o completa todas las repeticiones con una antes de cambiar.",
            commonMistakes: "No usar impulso para subir. Evitar apoyar la segunda pierna en el cajón para ayudarte. No bajar de forma descontrolada o saltar al bajar."
          },
          { 
            title: "Estocada Dinámica", 
            details: "Material: Mancuernas o barra. Paso largo, espalda recta.", 
            muscles: "Glúteos, cuádriceps, isquios, core", 
            reps: "3 series x 12 reps", 
            gifUrl:'https://gymvisual.com/img/p/7/0/2/5/7025.gif',
            detailedTechnique: "Da un paso largo hacia adelante manteniendo el torso erguido. Baja flexionando ambas rodillas hasta que la de atrás casi toque el suelo y la de adelante forme 90°. Empuja con el talón delantero para volver a la posición inicial. Puedes alternar piernas o completar todas las repeticiones con una pierna.",
            commonMistakes: "No inclinarse hacia adelante con el tronco. Evitar que la rodilla delantera sobrepase la punta del pie. No hacer el paso demasiado corto."
          },
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
          { 
            title: "Peso Muerto", 
            details: "Material: Mancuernas o barra. Espalda recta SIEMPRE, glúteos hacia atrás.", 
            muscles: "Glúteos, isquios, espalda baja", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Párate con los pies a la anchura de las caderas, sostén la barra o mancuernas frente a ti. Mantén la espalda recta y empuja los glúteos hacia atrás mientras bajas el peso. Baja hasta sentir el estiramiento en los isquiotibiales. Regresa a la posición inicial empujando las caderas hacia adelante.",
            commonMistakes: "No redondear la espalda en ningún momento. Evitar que las rodillas se muevan hacia adelante. No bajar más allá de tu flexibilidad natural."
          },
          { 
            title: "Sentadilla con Banda + Carga", 
            details: "Material: Banda en rodillas + peso. Bajar hasta 90° o más, control total.", 
            muscles: "Cuádriceps, glúteos, isquios, core", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Coloca una banda elástica alrededor de las rodillas y sostén peso (mancuernas o barra). Separa los pies a la anchura de los hombros. Baja como si fueras a sentarte en una silla, manteniendo las rodillas alineadas con los pies y empujando contra la banda. Baja hasta 90° o más si es posible.",
            commonMistakes: "No permitir que las rodillas se junten hacia adentro. Evitar inclinarse demasiado hacia adelante. No relajar la tensión de la banda durante el movimiento."
          },
          { 
            title: "Empuje de Caderas (Hip Thrust)", 
            details: "Material: Banco + barra. Foco en glúteos, no arquear espalda.", 
            muscles: "Glúteos, isquios, core", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Apoya la espalda media en un banco con los pies plantados en el suelo. Coloca la barra sobre las caderas (usa una almohadilla para comodidad). Empuja las caderas hacia arriba contrayendo los glúteos hasta formar una línea recta desde rodillas hasta hombros. Baja de forma controlada.",
            commonMistakes: "No arquear excesivamente la espalda. Evitar empujar con los talones en lugar de contraer glúteos. No extender completamente las caderas en la posición superior."
          },
        ]
      },
      {
        groupName: 'Tren Superior',
        list: [
          { 
            title: "Press Plano Barra", 
            details: "Material: Banco plano + barra. No rebotes, bajada controlada.", 
            muscles: "Pectorales, hombros, tríceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Acuéstate en el banco con los pies firmes en el suelo. Agarra la barra con un agarre ligeramente más amplio que los hombros. Baja la barra de forma controlada hasta tocar el pecho. Empuja la barra hacia arriba hasta extender completamente los brazos.",
            commonMistakes: "No hacer rebotar la barra en el pecho. Evitar levantar las caderas del banco. No usar un agarre demasiado amplio o estrecho."
          },
          { 
            title: "Vuelo Frontal", 
            details: "Material: Mancuernas. Sin balanceo, movimiento controlado.", 
            muscles: "Deltoides anterior", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Párate con los pies a la anchura de los hombros, sostén las mancuernas frente a los muslos. Eleva los brazos hacia adelante hasta la altura de los hombros manteniendo una ligera flexión en los codos. Baja lentamente controlando el peso.",
            commonMistakes: "No balancear el cuerpo para generar impulso. Evitar subir las mancuernas por encima de la altura de los hombros. No usar un peso excesivo que comprometa la técnica."
          },
          { 
            title: "Tríceps Polea", 
            details: "Material: Polea alta. Codos fijos, no balancear cuerpo.", 
            muscles: "Tríceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Párate frente a la polea alta con los codos pegados al cuerpo. Agarra la cuerda o barra con las manos. Extiende los antebrazos hacia abajo manteniendo los codos fijos. Regresa lentamente a la posición inicial manteniendo la tensión.",
            commonMistakes: "No mover los codos durante el movimiento. Evitar balancear el cuerpo o usar impulso. No relajar completamente los tríceps en la posición inicial."
          },
          { 
            title: "Bíceps + Press Militar (Biserie)", 
            details: "Material: Mancuernas o barra. Control, sin balancear.", 
            muscles: "Bíceps y deltoides", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Realiza primero curl de bíceps: flexiona los codos llevando el peso hacia los hombros. Inmediatamente después, press militar: empuja el peso sobre la cabeza extendiendo completamente los brazos. Baja controladamente y repite la secuencia.",
            commonMistakes: "No balancear el cuerpo durante el curl de bíceps. Evitar arquear la espalda en el press militar. No usar impulso entre los dos movimientos."
          },
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
                { 
                    title: "Camilla Isquio Monopodal", 
                    details: "Material: Camilla curl femoral. Una pierna a la vez.", 
                    muscles: "Isquiotibiales", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Igual que la camilla de isquio regular, pero trabajando una pierna a la vez. Acuéstate boca abajo y coloca solo un tobillo bajo la almohadilla. Flexiona la rodilla llevando el talón hacia el glúteo. Completa todas las repeticiones con una pierna antes de cambiar.",
                    commonMistakes: "No compensar con la pierna que no está trabajando. Evitar torcer el cuerpo para ayudar al movimiento. No usar menos rango de movimiento que con ambas piernas."
                },
                { 
                    title: "Vitalización con Rusa", 
                    details: "Material: Pesa rusa (kettlebell). Peso muerto + sentadilla.", 
                    muscles: "Glúteos, isquios, core", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Sostén la pesa rusa con ambas manos frente al cuerpo. Realiza un peso muerto llevando las caderas hacia atrás, luego al subir, continúa el movimiento haciendo una sentadilla. Es un movimiento fluido que combina ambos patrones de movimiento.",
                    commonMistakes: "No mantener la espalda recta durante todo el movimiento. Evitar separar los movimientos (deben ser fluidos). No usar un peso excesivo que comprometa la técnica."
                },
                { 
                    title: "Patada de Glúteos", 
                    details: "Material: Polea o banco. Pierna flexionada, empuje hacia atrás.", 
                    muscles: "Glúteos", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "En cuadrupedia o de pie en polea, mantén la pierna flexionada a 90°. Empuja la pierna hacia atrás y arriba contrayendo el glúteo. Mantén la cadera estable y el core activo. Regresa lentamente a la posición inicial manteniendo la tensión.",
                    commonMistakes: "No arquear excesivamente la espalda. Evitar rotar la cadera o el tronco. No usar impulso o movimientos bruscos."
                },
                { 
                    title: "Estocada Combinada con Sentadilla", 
                    details: "Material: Peso corporal o mancuernas. Alternancia estocada-sentadilla.", 
                    muscles: "Glúteos, cuádriceps, core", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Realiza una estocada hacia adelante, regresa al centro y inmediatamente haz una sentadilla. Luego estocada con la otra pierna y otra sentadilla. Es una secuencia continua: estocada derecha - sentadilla - estocada izquierda - sentadilla.",
                    commonMistakes: "No mantener el ritmo y control durante toda la secuencia. Evitar descansar entre movimientos. No comprometer la técnica por la fatiga."
                },
            ]
        },
        {
            groupName: 'Tren Superior',
            list: [
                { 
                    title: "Jalón en Polea", 
                    details: "Material: Polea alta, agarre amplio. Espalda recta, pecho erguido.", 
                    muscles: "Dorsales, bíceps", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Siéntate en la máquina con el pecho erguido y los hombros hacia atrás. Agarra la barra con un agarre más amplio que los hombros. Tira la barra hacia el pecho superior contrayendo los dorsales. Sube lentamente controlando el peso.",
                    commonMistakes: "No inclinarse hacia atrás excesivamente. Evitar tirar la barra hacia el cuello. No usar solo los brazos, enfocarse en contraer la espalda."
                },
                { 
                    title: "Vuelo Lateral", 
                    details: "Material: Mancuernas. Elevación lateral de brazos.", 
                    muscles: "Deltoides laterales", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Párate con las mancuernas a los lados del cuerpo. Eleva los brazos hacia los lados hasta la altura de los hombros, manteniendo una ligera flexión en los codos. Baja lentamente controlando el peso. Mantén el tronco estable.",
                    commonMistakes: "No balancear el cuerpo o usar impulso. Evitar subir los brazos por encima de la altura de los hombros. No elevar los hombros durante el movimiento."
                },
                { 
                    title: "Tríceps Fondo en Banco", 
                    details: "Material: Banco. Manos en banco, flexión de codos.", 
                    muscles: "Tríceps", 
                    reps: "3 series x 12 reps",
                    detailedTechnique: "Siéntate en el borde del banco con las manos apoyadas al lado de las caderas. Desliza el cuerpo hacia adelante y baja flexionando los codos hasta que los brazos formen 90°. Empuja hacia arriba extendiendo los brazos. Mantén los codos cerca del cuerpo.",
                    commonMistakes: "No bajar demasiado para evitar lesiones en los hombros. Evitar separar los codos del cuerpo. No usar impulso con las piernas."
                },
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
          { 
            title: "Sillón Cuádriceps Monopodal y Doble", 
            details: "Técnica: Primero una pierna, luego ambas.", 
            muscles: "Cuádriceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Primero realiza extensiones de cuádriceps con una sola pierna (técnica igual que el monopodal del lunes). Después de completar las repeticiones con una pierna, cambia a la otra. Finalmente, realiza repeticiones con ambas piernas simultáneamente.",
            commonMistakes: "No mantener la misma intensidad en ambas piernas. Evitar descansar demasiado entre las diferentes variaciones. No comprometer la técnica por la fatiga acumulada."
          },
          { 
            title: "Empuje de Cadera", 
            details: "Técnica: Igual que martes.", 
            muscles: "Glúteos, isquios", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Misma técnica que el martes: apoya la espalda media en un banco, coloca la barra sobre las caderas y empuja hacia arriba contrayendo los glúteos. Forma una línea recta desde rodillas hasta hombros. Baja controladamente.",
            commonMistakes: "Mismos errores que el martes: no arquear la espalda, no empujar con los talones, asegurar extensión completa de cadera."
          },
          { 
            title: "Twist en Colchoneta", 
            details: "Técnica: Giro de tronco tocando el suelo.", 
            muscles: "Abdominales oblicuos", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Siéntate en la colchoneta con las rodillas flexionadas y los pies elevados. Inclínate ligeramente hacia atrás manteniendo la espalda recta. Gira el tronco hacia un lado tocando el suelo con las manos, regresa al centro y gira hacia el otro lado. Mantén el core activo.",
            commonMistakes: "No redondear la espalda durante el movimiento. Evitar usar impulso para girar. No bajar los pies al suelo durante el ejercicio."
          },
          { 
            title: "Press Militar", 
            details: "Técnica: Empuje sobre la cabeza.", 
            muscles: "Hombros, tríceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Párate con los pies a la anchura de los hombros, sostén las mancuernas o barra a la altura de los hombros. Empuja el peso sobre la cabeza extendiendo completamente los brazos. Baja controladamente hasta la posición inicial. Mantén el core activo.",
            commonMistakes: "No arquear excesivamente la espalda. Evitar empujar la cabeza hacia adelante. No usar impulso con las piernas."
          },
          { 
            title: "Remo 90°", 
            details: "Técnica: Flexión de cadera, tirón hacia abdomen.", 
            muscles: "Dorsales, romboides, bíceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Inclínate hacia adelante manteniendo la espalda recta (aproximadamente 90°). Sostén las mancuernas o barra con los brazos extendidos. Tira el peso hacia el abdomen contrayendo los músculos de la espalda. Baja controladamente manteniendo la posición del tronco.",
            commonMistakes: "No redondear la espalda durante el movimiento. Evitar usar impulso o balancear el cuerpo. No tirar el peso hacia el pecho en lugar del abdomen."
          },
          { 
            title: "Bíceps (Curl)", 
            details: "Técnica: Flexión de codos controlada.", 
            muscles: "Bíceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Párate con los brazos extendidos a los lados del cuerpo, sostén las mancuernas o barra. Flexiona los codos llevando el peso hacia los hombros manteniendo los codos pegados al cuerpo. Baja lentamente controlando el peso hasta la extensión completa.",
            commonMistakes: "No balancear el cuerpo o usar impulso. Evitar mover los codos hacia adelante o hacia atrás. No realizar repeticiones parciales."
          },
          { 
            title: "Tríceps Sobre Cabeza", 
            details: "Técnica: Extensión con mancuerna o polea.", 
            muscles: "Tríceps", 
            reps: "3 series x 12 reps",
            detailedTechnique: "Sostén una mancuerna con ambas manos sobre la cabeza o usa una polea. Mantén los codos apuntando hacia adelante y baja el peso flexionando solo los antebrazos. Extiende los brazos completamente regresando a la posición inicial. Mantén los codos estables.",
            commonMistakes: "No mover los codos durante el movimiento. Evitar arquear la espalda. No usar un peso excesivo que comprometa el rango de movimiento."
          },
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