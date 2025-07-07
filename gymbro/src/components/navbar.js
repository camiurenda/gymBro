import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <FontAwesomeIcon icon={faHome} />
        <span>Entrenamiento</span>
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <FontAwesomeIcon icon={faChartLine} />
        <span>Progreso</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;