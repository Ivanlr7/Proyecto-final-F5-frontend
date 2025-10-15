import { Search, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { logoutThunk, checkAuthThunk, clearError } from '../../store/slices/authSlice'
import userService from '../../api/services/UserService'
import "./Header2.css";

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error,
    isInitialized,
    token 
  } = useSelector(state => state.auth)

  const [profileImageUrl, setProfileImageUrl] = useState(null)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthThunk())
    }
  }, [dispatch, isInitialized])

  // Cargar imagen de perfil cuando el usuario esté autenticado
  useEffect(() => {
    const loadProfileImage = async () => {
      if (isAuthenticated && token && user) {
        try {
          const result = await userService.getCurrentUser(token)
          if (result.success && result.data?.profileImage) {
            setProfileImageUrl(result.data.profileImage)
          }
        } catch (error) {
          console.error('Error cargando imagen de perfil en header:', error)
        }
      } else {
        setProfileImageUrl(null)
      }
    }

    loadProfileImage()
  }, [isAuthenticated, token, user])

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
          <Link to="peliculas" className="header__nav-link header__nav-link--active">Películas</Link>
          
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
                </span>
              </div>
              <Link to="/me" className="header__avatar">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt={`Avatar de ${user?.sub || user?.username || 'Usuario'}`}
                    className="header__avatar-image"
                    onError={(e) => {
                      console.error('Error cargando imagen de perfil en header');
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="header__avatar-initials"
                  style={{ display: profileImageUrl ? 'none' : 'flex' }}
                >
                  {(user?.sub || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              </Link>
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