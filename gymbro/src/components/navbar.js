// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error("Error al cerrar sesión");
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
        <button className="nav-link log-weight-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;