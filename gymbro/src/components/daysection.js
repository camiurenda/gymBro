import React from 'react';
import ExerciseCard from './excersicecard';

const DaySection = ({ day, title, theme, exercises }) => (
    <div className="day-section">
        <div className={`day-header ${theme}`}>{day} - {title}</div>
        <div className="day-content">
            {exercises.map(group => (
                <div key={group.groupName} className="muscle-group">
                    <h4>{group.groupName}</h4>
                    <div className="exercise-grid">
                        {group.list.map(ex => <ExerciseCard key={ex.title} {...ex} />)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default DaySection;