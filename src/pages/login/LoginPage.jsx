import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, CheckCircle2, AlertCircle } from "lucide-react";
import authService from "../../api/services/AuthService";
import "./LoginPage.css";
import { Link } from "react-router-dom";

export default function LoginPage({ onNavigateToHome, onNavigateToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = "";

    if (field === "usernameOrEmail") {
      if (!value.trim()) {
        error = "Este campo es requerido";
      }
    }

    if (field === "password") {
      if (!value) {
        error = "La contraseña es requerida";
      } else if (value.length < 6) {
        error = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes previos
    setMessage({ type: '', text: '' });
    
    setTouched({
      usernameOrEmail: true,
      password: true
    });

    const isUsernameValid = validateField("usernameOrEmail", formData.usernameOrEmail);
    const isPasswordValid = validateField("password", formData.password);

    if (isUsernameValid && isPasswordValid) {
      setIsLoading(true);
      
      try {
        // Preparar datos para el AuthService (usar identifier como espera el backend)
        const loginData = {
          identifier: formData.usernameOrEmail, // El backend espera 'identifier'
          password: formData.password
        };
        
        // Llamar al service de login
        const result = await authService.login(loginData);
        
        if (result.success) {
          // Login exitoso
          setMessage({ 
            type: 'success', 
            text: result.message || '¡Login exitoso!' 
          });
          
          // Limpiar formulario
          setFormData({
            usernameOrEmail: "",
            password: ""
          });
          
          // Opcional: Llamar callback de éxito
          if (onLoginSuccess) {
            setTimeout(() => {
              onLoginSuccess(result.user, result.token);
            }, 1000);
          }
        }
        
      } catch (error) {
        console.error('Error en el login:', error);
        setMessage({ 
          type: 'error', 
          text: error.message || 'Error al iniciar sesión. Inténtalo de nuevo.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  const isEmail = (value) => {
    return value.includes("@");
  };

  const getInputIcon = () => {
    if (!formData.usernameOrEmail) return <User className="login-page__input-icon" />;
    return isEmail(formData.usernameOrEmail) 
      ? <Mail className="login-page__input-icon" />
      : <User className="login-page__input-icon" />;
  };

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__background-blob login-page__background-blob--blue" />
        <div className="login-page__background-blob login-page__background-blob--purple" />
      </div>

    
      {onNavigateToHome && (
        <button 
          onClick={onNavigateToHome}
          className="login-page__back-btn"
        >
          <ArrowLeft className="login-page__back-icon" />
          Volver al inicio
        </button>
      )}

      <div className="login-page__container">
        <div className="login-page__card">
          {/* Header */}
          <div className="login-page__header">
            <div className="login-page__logo">
              <span className="login-page__logo-text">R</span>
            </div>
            <h1 className="login-page__title">Iniciar Sesión</h1>
            <p className="login-page__subtitle">
              Bienvenido de vuelta a ReviewVerso
            </p>
          </div>

          {/* Form */}
          <form className="login-page__form" onSubmit={handleSubmit}>
            {/* Mostrar mensaje de éxito o error */}
            {message.text && (
              <div className={`login-page__message login-page__message--${message.type}`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="login-page__message-icon" />
                ) : (
                  <AlertCircle className="login-page__message-icon" />
                )}
                {message.text}
              </div>
            )}
      
            <div className="login-page__field">
              <label htmlFor="usernameOrEmail" className="login-page__label">
                Usuario o Email
              </label>
              <div className="login-page__input-wrapper">
                {getInputIcon()}
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("usernameOrEmail")}
                  placeholder="tu_usuario o email@ejemplo.com"
                  className={`login-page__input ${
                    touched.usernameOrEmail && errors.usernameOrEmail ? "login-page__input--error" : ""
                  }`}
                />
              </div>
              {touched.usernameOrEmail && errors.usernameOrEmail && (
                <span className="login-page__error">
                  <AlertCircle className="login-page__error-icon" />
                  {errors.usernameOrEmail}
                </span>
              )}
              {touched.usernameOrEmail && !errors.usernameOrEmail && formData.usernameOrEmail && (
                <span className="login-page__success">
                  <CheckCircle2 className="login-page__success-icon" />
                  {isEmail(formData.usernameOrEmail) ? "Email válido" : "Usuario válido"}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="login-page__field">
              <label htmlFor="password" className="login-page__label">
                Contraseña
              </label>
              <div className="login-page__input-wrapper">
                <Lock className="login-page__input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  className={`login-page__input ${
                    touched.password && errors.password ? "login-page__input--error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-page__toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="login-page__toggle-icon" />
                  ) : (
                    <Eye className="login-page__toggle-icon" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <span className="login-page__error">
                  <AlertCircle className="login-page__error-icon" />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="login-page__forgot-password">
              <button type="button" className="login-page__link">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-page__submit"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register Link */}
          <p className="login-page__register-link">
            ¿No tienes cuenta?{" "}
            {onNavigateToRegister ? (
              <button
                onClick={onNavigateToRegister}
                className="login-page__link"
              >
                Regístrate aquí
              </button>
            ) : (
            <Link to="/register" className="login-page__link">
              Regístrate aquí
            </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
