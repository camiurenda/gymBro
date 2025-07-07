import React from 'react';
import ExerciseCard from './excersicecard'; // Reutilizaremos una tarjeta de ejercicio

const mobilityExercises = [
    { title: "Puente Plancha Frontal (Plank)", details: "Boca abajo, antebrazos y puntas de pies, cuerpo recto", muscles: "Core completo (abdominales, lumbares, glúteos)", reps: "2 series x 30 seg" },
    { title: "Movilidad Lateral con Banda", details: "Rotación de torso con banda elástica, cadera estable", muscles: "Abdominales oblicuos, movilidad columna", reps: "2 series x 12 reps" }
];

const MobilitySection = () => (
    <div className="mobility-section">
        <h3>🧘‍♀️ Movilidad Articular (Todos los días - 10 min)</h3>
        <div className="exercise-grid">
            {mobilityExercises.map(ex => <ExerciseCard key={ex.title} {...ex} />)}
        </div>
    </div>
);

export default MobilitySection;