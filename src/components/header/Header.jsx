import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { logoutThunk, checkAuthThunk, clearError } from '../../store/slices/authSlice'
import './Header.css'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Seleccionar estado del store
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

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-profile')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }


  if (!isInitialized && loading) {
    return (
      <nav className="navigation">
        <div className="nav-brand">
          <Link to="/">ReviewVerso</Link>
        </div>
        <div className="nav-loading">Cargando...</div>
      </nav>
    )
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">ReviewVerso</Link>
      </div>
      

      {error && (
        <div className="nav-error">
          {error}
        </div>
      )}
      
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
        
        {/* Renderizado condicional basado en autenticación */}
        {!isAuthenticated ? (
          // Usuario NO autenticado
          <>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
          </>
        ) : (
          // Usuario autenticado
          <>
            <li className="user-profile">
              <div 
                className="user-info"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {/* Imagen de perfil */}
                <div className="profile-image-container">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Perfil" 
                      className="profile-image"
                      onError={(e) => {
                        // Si falla cargar la imagen, mostrar avatar por defecto
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Avatar por defecto con iniciales */}
                  <div 
                    className="profile-avatar" 
                    style={{ 
                      display: user?.profileImage ? 'none' : 'flex' 
                    }}
                  >
                    {(user?.sub || user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Nombre del usuario */}
                <span className="user-welcome">
                  Hola, {user?.sub || user?.username || 'Usuario'}
                </span>
                
                {/* Icono dropdown */}
                <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              
              {/* Dropdown menu */}
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-item">
                    <span>👤 Ver Perfil</span>
                  </div>
                  <div className="dropdown-item">
                    <span>⚙️ Configuración</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div 
                    className="dropdown-item logout-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      handleLogout();
                    }}
                  >
                    <span>{loading ? '⏳ Cerrando...' : '🚪 Cerrar Sesión'}</span>
                  </div>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Header