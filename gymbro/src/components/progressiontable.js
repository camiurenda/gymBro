import React from 'react';

const ProgressionTable = () => (
    <div className="progression-table">
        <table>
            <thead>
                <tr>
                    <th>Semana</th>
                    <th>Series x Repeticiones</th>
                    <th>Notas</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>1 y 2</strong></td>
                    <td>3 x 12</td>
                    <td>Aprender técnica, pesos bajos/moderados</td>
                </tr>
                <tr>
                    <td><strong>3 y 4</strong></td>
                    <td>3 x 14</td>
                    <td>Progresión suave, un poco más de esfuerzo</td>
                </tr>
                <tr>
                    <td><strong>5 a 8</strong></td>
                    <td>3 x 12</td>
                    <td>Sube la carga (peso)</td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default ProgressionTable;