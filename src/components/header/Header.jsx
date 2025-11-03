import { Search, User, Menu } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logoutThunk, checkAuthThunk, clearError } from '../../store/slices/authSlice';
import userService from '../../api/services/UserService';
import Avatar from "../common/Avatar";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error,
    isInitialized,
    token,
    role
  } = useSelector(state => state.auth)

  const [profileImageUrl, setProfileImageUrl] = useState(null)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthThunk())
    }
  }, [dispatch, isInitialized])


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

  const handleDropdownOpen = () => setDropdownOpen(true);
  const handleDropdownClose = () => setDropdownOpen(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!document.querySelector('.header__avatar-dropdown')?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <img src="/logo.svg" alt="ReviewVerso Logo" className="header__logo-image" />
          </Link>
          <Link to="/" className="header__brand-name">ReviewVerso</Link>
        </div>

        {/* Navigation y acciones en menú responsive */}
        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`} onClick={() => setMenuOpen(false)}>
          {isAuthenticated && (
            <Link to="/me" className="header__avatar header__avatar--mobile" style={{ margin: '0 auto 1.5rem auto' }}>
              <Avatar
                image={profileImageUrl}
                name={user?.userName || user?.username || user?.sub || 'U'}
                size={48}
                className="header__avatar-image"
              />
            </Link>
          )}
          <Link to="/" className="header__nav-link header__nav-link--active">Inicio</Link>
          <Link to="peliculas" className="header__nav-link header__nav-link--active">Películas</Link>
          <Link to="series" className="header__nav-link header__nav-link--active">Series</Link>
          <Link to="videojuegos" className="header__nav-link header__nav-link--active">Videojuegos</Link>
          <Link to="libros" className="header__nav-link header__nav-link--active">Libros</Link>
          <Link to="listas" className="header__nav-link header__nav-link--active">Listas</Link>
          
          {/* Opciones de usuario autenticado en menú móvil */}
          {isAuthenticated && (
            <>
              <Link to="/me" className="header__nav-link header__nav-link--active header__nav-link--mobile-only">Área Personal</Link>
              {Array.isArray(role) && role.includes('admin') && (
                <Link to="/admin" className="header__nav-link header__nav-link--active header__nav-link--mobile-only">Zona Admin</Link>
              )}
            </>
          )}
          
          <div className="header__nav-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="header__login-btn header__login-btn--mobile">Iniciar Sesión</Link>
                <Link to="/register" className="header__register-btn header__register-btn--mobile">Registrarse</Link>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogout}
                  className="header__logout-btn header__logout-btn--mobile"
                  disabled={loading}
                >
                  {loading ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Botón hamburguesa (solo visible en móvil) */}
        <button
          className="header__burger"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={28} />
        </button>

        {/* Acciones en escritorio */}
        <div className="header__actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="header__login-btn">Iniciar Sesión</Link>
              {/* <Link to="/register" className="header__register-btn">Registrarse</Link> */}
            </>
          ) : (
            <>
              <div
                className="header__avatar-dropdown"
                onMouseEnter={handleDropdownOpen}
                onMouseLeave={handleDropdownClose}
              >
                <div className="header__avatar-dropdown-trigger">
                  <div className="header__user-info">
                    <span className="header__username">
                      Hola, {user?.userName || user?.username || user?.sub || 'Usuario'}
                    </span>
                  </div>
                  <Link to="/me" className="header__avatar">
                    <Avatar
                      image={profileImageUrl}
                      name={user?.userName || user?.username || user?.sub || 'U'}
                      size={40}
                      className="header__avatar-image"
                    />
                  </Link>
                </div>
                {dropdownOpen && (
                  <div className="header__dropdown-menu">
                    <Link
                      to="/me"
                      className="header__dropdown-link"
                      onClick={handleDropdownClose}
                    >
                      Área personal
                    </Link>
                    {Array.isArray(role) && role.includes('admin') && (
                      <Link
                        to="/admin"
                        className="header__dropdown-link"
                        onClick={handleDropdownClose}
                      >
                        Zona admin
                      </Link>
                    )}
                    <button
                      className="header__dropdown-link header__dropdown-logout"
                      type="button"
                      onClick={e => {
                        handleDropdownClose();
                        handleLogout(e);
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Cerrando...' : 'Cerrar sesión'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}