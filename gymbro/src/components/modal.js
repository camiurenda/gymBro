import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, children }) => {
  // Si el modal no está abierto, no renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    // El "portal-overlay" es el fondo oscuro semitransparente.
    <div className="modal-overlay" onClick={onClose}>
      {/* Detenemos la propagación del clic para que no se cierre al hacer clic dentro del contenido. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;