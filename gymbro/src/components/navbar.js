import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 1. Importamos los nuevos íconos
import { faHome, faChartLine, faWeightScale } from '@fortawesome/free-solid-svg-icons';

// 2. Recibimos una nueva prop: onLogWeightClick
const Navbar = ({ onLogWeightClick }) => {
  return (
    <nav className="navbar">
      <div className="nav-links-left">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FontAwesomeIcon icon={faHome} />
          <span>Entrenamiento</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>Progreso</span>
        </NavLink>
      </div>
      <div className="nav-links-right">
        {/* 3. Creamos el nuevo botón que llama a la función de la prop */}
        <button className="nav-link log-weight-button" onClick={onLogWeightClick}>
          <FontAwesomeIcon icon={faWeightScale} />
          <span>Registrar Peso</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;