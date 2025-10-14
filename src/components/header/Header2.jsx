import { Search, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logoutThunk, checkAuthThunk, clearError } from '../../store/slices/authSlice'
import "./Header2.css";

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error,
    isInitialized 
  } = useSelector(state => state.auth)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthThunk())
    }
  }, [dispatch, isInitialized])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__brand">
          <div className="header__logo">
            <span className="header__logo-text">R</span>
          </div>
          <Link to="/" className="header__brand-name">ReviewVerso</Link>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <Link to="/" className="header__nav-link header__nav-link--active">Inicio</Link>
          <a href="#" className="header__nav-link">Películas</a>
          <a href="#" className="header__nav-link">Series</a>
          <a href="#" className="header__nav-link">Videojuegos</a>
          <a href="#" className="header__nav-link">Libros</a>
        </nav>

        {/* Search and Profile */}
        <div className="header__actions">
          {!isAuthenticated ? (
            // Usuario NO autenticado - Mostrar botones de login y registro
            <>
              <Link to="/login" className="header__login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="header__register-btn">
                Registrarse
              </Link>
            </>
          ) : (
            // Usuario autenticado - Mostrar perfil y logout
            <>
              <div className="header__user-info">
                <span className="header__username">
                  Hola, {user?.sub || user?.username || 'Usuario'}
                         <Link to="/me"></Link>
                </span>
              </div>
              <div className="header__avatar">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={`Avatar de ${user?.sub || user?.username || 'Usuario'}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                 
                ) : (
                  <div className="header__avatar-initials">
                    {(user?.sub || user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="header__logout-btn"
                disabled={loading}
              >
                {loading ? 'Cerrando...' : 'Cerrar Sesión'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}