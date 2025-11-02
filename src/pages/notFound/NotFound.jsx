import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found">
      <div className="not-found__background">
        <div className="not-found__background-blob not-found__background-blob--blue" />
        <div className="not-found__background-blob not-found__background-blob--purple" />
      </div>

      <div className="not-found__container">
        <div className="not-found__content">
          {/* Icon */}
          <div className="not-found__icon">
            <FileQuestion size={80} />
          </div>

          {/* 404 Number */}
          <h1 className="not-found__number">404</h1>

          {/* Title */}
          <h2 className="not-found__title">Página no encontrada</h2>

          {/* Description */}
          <p className="not-found__description">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
            Verifica la URL o regresa a la página principal.
          </p>

          {/* Actions */}
          <div className="not-found__actions">
            <button onClick={handleGoBack} className="not-found__btn not-found__btn--secondary">
              <ArrowLeft size={20} />
              Volver atrás
            </button>
            <Link to="/" className="not-found__btn not-found__btn--primary">
              <Home size={20} />
              Ir al inicio
            </Link>
          </div>

 
 
        </div>
      </div>
    </div>
  );
}
