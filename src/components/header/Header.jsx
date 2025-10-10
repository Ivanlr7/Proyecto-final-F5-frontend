import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">ReviewVerso</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/about">Acerca de</Link>
        </li>
        <li>
          <Link to="/contact">Contacto</Link>
        </li>
        <li>
          <Link to="/register">Registrarse</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header