// src/components/navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faSignOutAlt, faWeightScale } from '@fortawesome/free-solid-svg-icons'; // Usamos faWeightScale que es más apropiado

// 1. El Navbar ahora recibe la prop 'onLogWeightClick'
const Navbar = ({ onLogWeightClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links-left">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FontAwesomeIcon icon={faHome} /> <span>Entrenamiento</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <FontAwesomeIcon icon={faChartLine} /> <span>Progreso</span>
        </NavLink>
      </div>
      <div className="nav-links-right">
        {/* 2. Este botón ahora simplemente llama a la función que le pasa App.js */}
        <button className="nav-link log-weight-button" onClick={onLogWeightClick}>
          <FontAwesomeIcon icon={faWeightScale} /> <span>Registrar Peso</span>
        </button>
        <button className="nav-link" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;