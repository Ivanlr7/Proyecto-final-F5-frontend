import { useState } from "react";
import { ArrowLeft, User, Mail, Camera, Edit2, Save, X } from "lucide-react";
import "./UserPage.css";

export default function UserPage({ onNavigateToHome }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG_iO53fDAGLbMQW8GS9R6m_RLD03XXUS2Tw&s",
    userName: "Usuario Prueba",
    email: "Usuario@prueba.com"
  });

  const [editedData, setEditedData] = useState({ ...profileData });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedData({ ...editedData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
    setImagePreview(null);
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    setImagePreview(null);
   
    console.log("Datos guardados:", editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
    setImagePreview(null);
  };

  return (
    <div className="user-profile">
      {/* Background */}
      <div className="user-profile__background">
        <div className="user-profile__background-blob user-profile__background-blob--blue" />
        <div className="user-profile__background-blob user-profile__background-blob--purple" />
      </div>

      {/* Back Button */}
      <button className="user-profile__back-btn" onClick={onNavigateToHome}>
        <ArrowLeft className="user-profile__back-icon" />
        Volver al Inicio
      </button>

      {/* Container */}
      <div className="user-profile__container">
        <div className="user-profile__card">
          {/* Header */}
          <div className="user-profile__header">
            <div className="user-profile__logo">
              <span className="user-profile__logo-text">R</span>
            </div>
            <h1 className="user-profile__title">Mi Perfil</h1>
            <p className="user-profile__subtitle">
              Gestiona tu información personal
            </p>
          </div>

          {/* Profile Content */}
          <div className="user-profile__content">
            {/* Profile Image */}
            <div className="user-profile__image-section">
              <div className="user-profile__image-container">
                {(imagePreview || editedData.profileImage) ? (
                  <img
                    src={imagePreview || editedData.profileImage}
                    alt="Profile"
                    className="user-profile__image"
                  />
                ) : (
                  <div className="user-profile__image-placeholder">
                    <User className="user-profile__placeholder-icon" />
                  </div>
                )}
                
                {isEditing && (
                  <label className="user-profile__image-overlay">
                    <Camera className="user-profile__camera-icon" />
                    <span className="user-profile__change-text">Cambiar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="user-profile__file-input"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="user-profile__form">
              {/* User Name Field */}
              <div className="user-profile__field">
                <label className="user-profile__label">
                  <User className="user-profile__label-icon" />
                  Nombre de Usuario
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="userName"
                    value={editedData.userName}
                    onChange={handleInputChange}
                    className="user-profile__input"
                    placeholder="Ingresa tu nombre"
                  />
                ) : (
                  <div className="user-profile__value">{profileData.userName}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="user-profile__field">
                <label className="user-profile__label">
                  <Mail className="user-profile__label-icon" />
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="user-profile__input"
                    placeholder="tu@email.com"
                  />
                ) : (
                  <div className="user-profile__value">{profileData.email}</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="user-profile__actions">
                {isEditing ? (
                  <>
                    <button 
                      className="user-profile__btn user-profile__btn--save"
                      onClick={handleSave}
                    >
                      <Save className="user-profile__btn-icon" />
                      Guardar Cambios
                    </button>
                    <button 
                      className="user-profile__btn user-profile__btn--cancel"
                      onClick={handleCancel}
                    >
                      <X className="user-profile__btn-icon" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button 
                    className="user-profile__btn user-profile__btn--edit"
                    onClick={handleEdit}
                  >
                    <Edit2 className="user-profile__btn-icon" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Additional test Info */}
          <div className="user-profile__footer">
            <div className="user-profile__stats">
              <div className="user-profile__stat">
                <span className="user-profile__stat-value">24</span>
                <span className="user-profile__stat-label">Reseñas</span>
              </div>
              <div className="user-profile__stat">
                <span className="user-profile__stat-value">128</span>
                <span className="user-profile__stat-label">Me gusta</span>
              </div>
              <div className="user-profile__stat">
                <span className="user-profile__stat-value">56</span>
                <span className="user-profile__stat-label">Siguiendo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
