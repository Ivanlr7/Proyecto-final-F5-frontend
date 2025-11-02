import React from 'react';
import { Trash2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import './Modal.css';


const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  subMessage,
  type = 'alert', // 'confirm', 'alert', 'success', 'error', 'info'
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  icon
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  // Seleccionar el icono según el tipo
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'confirm':
        return <Trash2 className="modal__icon" />;
      case 'error':
        return <AlertCircle className="modal__icon" />;
      case 'success':
        return <CheckCircle className="modal__icon" />;
      case 'info':
        return <Info className="modal__icon" />;
      default:
        return <Info className="modal__icon" />;
    }
  };

  // Determinar la clase del botón de confirmación según el tipo
  const getConfirmButtonClass = () => {
    switch (type) {
      case 'confirm':
        return 'modal__btn--delete';
      case 'error':
        return 'modal__btn--delete';
      case 'success':
        return 'modal__btn--success';
      default:
        return 'modal__btn--primary';
    }
  };

  return (
    <div className="modal__overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
        </div>
        
        <div className="modal__content">
          <div className={`modal__icon-wrapper modal__icon-wrapper--${type}`}>
            {getIcon()}
          </div>
          <p className="modal__text">{message}</p>
          {subMessage && (
            <p className="modal__subtext">{subMessage}</p>
          )}
        </div>
        
        <div className="modal__actions">
          <button
            onClick={handleConfirm}
            className={`modal__btn ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="modal__btn modal__btn--cancel"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
