// src/components/Navbar.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faSignOutAlt, faWeightHanging } from '@fortawesome/free-solid-svg-icons';
import WeightLogForm from './weightloform'; // Asegúrate de que la ruta sea correcta
import Modal from './modal'; // Asumiendo que tienes un componente Modal

const Navbar = () => {
  const { logout, user } = useAuth(); // Obtener el usuario actual
  const navigate = useNavigate();
  const [isWeightModalOpen, setWeightModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error("Error al cerrar sesión");
    }
  };

  return (
    <>
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
          <button className="nav-link log-weight-button" onClick={() => setWeightModalOpen(true)}>
            <FontAwesomeIcon icon={faWeightHanging} /> <span>Registrar Peso</span>
          </button>
          <button className="nav-link" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
      {user && (
        <Modal isOpen={isWeightModalOpen} onClose={() => setWeightModalOpen(false)}>
          <WeightLogForm userId={user.uid} onClose={() => setWeightModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Navbar;
