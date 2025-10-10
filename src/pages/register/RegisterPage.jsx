import { useState } from "react";
import { Eye, EyeOff, Upload, User, Mail, Lock, Check, X, ArrowLeft } from "lucide-react";
import "./RegisterPage.css";


export default function RegisterPage({ onNavigateToHome, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));


      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};


    if (!formData.userName.trim()) {
      newErrors.userName = "El nombre de usuario es obligatorio";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "El nombre de usuario debe tener al menos 3 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }


    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }


    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
   
      alert("¡Registro completado con éxito!");
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-page__background">
        <div className="register-page__background-blob register-page__background-blob--blue" />
        <div className="register-page__background-blob register-page__background-blob--purple" />
      </div>

   
      {onNavigateToHome && (
        <button 
          onClick={onNavigateToHome}
          className="register-page__back-btn"
        >
          <ArrowLeft className="register-page__back-icon" />
          Volver al inicio
        </button>
      )}

      <div className="register-page__container">
        <div className="register-page__card">
   
          <div className="register-page__header">
            <div className="register-page__logo">
              <span className="register-page__logo-text">R</span>
            </div>
            <h1 className="register-page__title">Crear Cuenta</h1>
            <p className="register-page__subtitle">
              Únete a ReviewVerso y comienza a compartir tus reseñas
            </p>
          </div>

          <form className="register-page__form" onSubmit={handleSubmit}>
       
            <div className="register-page__image-upload">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="register-page__file-input"
              />
              <label htmlFor="profileImage" className="register-page__image-label">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="register-page__image-preview"
                  />
                ) : (
                  <div className="register-page__image-placeholder">
                    <Upload className="register-page__upload-icon" />
                    <span className="register-page__upload-text">Subir foto de perfil</span>
                  </div>
                )}
              </label>
            </div>

            <div className="register-page__field">
              <label htmlFor="userName" className="register-page__label">
                Nombre de Usuario
              </label>
              <div className="register-page__input-wrapper">
                <User className="register-page__input-icon" />
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`register-page__input ${errors.userName ? 'register-page__input--error' : ''}`}
                  placeholder="Tu nombre de usuario"
                />
              </div>
              {errors.userName && (
                <span className="register-page__error">
                  <X className="register-page__error-icon" />
                  {errors.userName}
                </span>
              )}
            </div>

     
            <div className="register-page__field">
              <label htmlFor="email" className="register-page__label">
                Correo Electrónico
              </label>
              <div className="register-page__input-wrapper">
                <Mail className="register-page__input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`register-page__input ${errors.email ? 'register-page__input--error' : ''}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <span className="register-page__error">
                  <X className="register-page__error-icon" />
                  {errors.email}
                </span>
              )}
            </div>

          
            <div className="register-page__field">
              <label htmlFor="password" className="register-page__label">
                Contraseña
              </label>
              <div className="register-page__input-wrapper">
                <Lock className="register-page__input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`register-page__input ${errors.password ? 'register-page__input--error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="register-page__toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="register-page__error">
                  <X className="register-page__error-icon" />
                  {errors.password}
                </span>
              )}
              {formData.password && !errors.password && (
                <div className="register-page__password-strength">
                  <div className="register-page__strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`register-page__strength-bar ${
                          level <= passwordStrength
                            ? `register-page__strength-bar--${
                                passwordStrength <= 1 ? 'weak' :
                                passwordStrength <= 2 ? 'medium' :
                                passwordStrength <= 3 ? 'good' : 'strong'
                              }`
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="register-page__strength-text">
                    {passwordStrength <= 1 ? 'Débil' :
                     passwordStrength <= 2 ? 'Media' :
                     passwordStrength <= 3 ? 'Buena' : 'Fuerte'}
                  </span>
                </div>
              )}
            </div>

       
            <div className="register-page__field">
              <label htmlFor="confirmPassword" className="register-page__label">
                Confirmar Contraseña
              </label>
              <div className="register-page__input-wrapper">
                <Lock className="register-page__input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`register-page__input ${errors.confirmPassword ? 'register-page__input--error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="register-page__toggle-password"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="register-page__error">
                  <X className="register-page__error-icon" />
                  {errors.confirmPassword}
                </span>
              )}
              {formData.confirmPassword && 
               formData.password === formData.confirmPassword && 
               !errors.confirmPassword && (
                <span className="register-page__success">
                  <Check className="register-page__success-icon" />
                  Las contraseñas coinciden
                </span>
              )}
            </div>

            <button type="submit" className="register-page__submit">
              Crear Cuenta
            </button>


            <p className="register-page__login-link">
              ¿Ya tienes cuenta?{" "}
              {onNavigateToLogin ? (
                <button 
                  type="button"
                  onClick={onNavigateToLogin}
                  className="register-page__link"
                >
                  Iniciar sesión
                </button>
              ) : (
                <a href="#" className="register-page__link">
                  Iniciar sesión
                </a>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
