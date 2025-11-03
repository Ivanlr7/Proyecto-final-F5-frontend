import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <img 
            src="/logo.svg" 
            alt="ReviewVerso Logo" 
            className="footer__logo"
          />
          <span className="footer__brand-name">ReviewVerso</span>
        </div>
        
        <div className="footer__links">
          <Link to="/contact" className="footer__link">
            Contacto
          </Link>
          <Link to="/aviso-legal" className="footer__link">
            Aviso legal
          </Link>
          <Link to="/politica-cookies" className="footer__link">
            Política de cookies
          </Link>
        </div>
        
        <p className="footer__copyright">
          © {currentYear} ReviewVerso. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
