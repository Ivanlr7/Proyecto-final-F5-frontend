import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logoutThunk, checkAuthThunk, clearError } from '../../store/slices/authSlice'
import './Header.css'

function Header() {
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
            <li>
              <span className="user-welcome">
                Hola, {user?.sub || user?.username || 'Usuario'}
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="logout-button"
                disabled={loading}
              >
                {loading ? 'Cerrando...' : 'Cerrar Sesión'}
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Header