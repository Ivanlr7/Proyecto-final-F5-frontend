import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-text">R</span>
          </div>
          <span className="footer__brand-name">ReviewVerso</span>
        </div>
        <p className="footer__copyright">
          © 2024 ReviewVerso. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
