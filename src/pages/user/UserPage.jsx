import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../store/slices/authSlice";
import { ArrowLeft, User, Mail, Edit2, Save, X, Check } from "lucide-react";
import Avatar from "../../components/common/Avatar";
import userService from "../../api/services/UserService";
import { updateUserThunk } from "../../store/slices/authSlice";
import Modal from "../../components/common/Modal";
import "./UserPage.css";

export default function UserPage({ onNavigateToHome }) {
  const { user: authUser, token, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    profileImage: null,
    userName: "",
    email: ""
  });
  const [editedData, setEditedData] = useState({ ...profileData });
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'alert',
    title: '',
    message: '',
    onConfirm: null
  });

  // Función auxiliar para mostrar modales
  const showModalMessage = (type, title, message, onConfirm = null) => {
    setModalConfig({ type, title, message, onConfirm });
    setShowModal(true);
  };

  const handleDeleteAccount = async () => {
    showModalMessage(
      'confirm',
      'Confirmar eliminación de cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      async () => {
        try {
          setDeleteLoading(true);
          setMessage({ type: '', text: '' });
          await userService.deleteUser(profileData.idUser, token);
          // Cerrar sesión y redirigir
          await dispatch(logoutThunk());
          if (onNavigateToHome) onNavigateToHome();
        } catch (error) {
          setMessage({ type: 'error', text: error.message || "Error al eliminar la cuenta" });
          showModalMessage('error', 'Error', error.message || "Error al eliminar la cuenta");
        } finally {
          setDeleteLoading(false);
        }
      }
    );
  };
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        const result = await userService.getCurrentUser(token);
        
        if (result.success && result.data) {
          const userData = result.data;
          setProfileData({
            profileImage: userData.profileImage || null,
            userName: userData.userName || "",
            email: userData.email || "",
            idUser: userData.idUser
          });
          setEditedData({
            profileImage: userData.profileImage || null,
            userName: userData.userName || "",
            email: userData.email || "",
            idUser: userData.idUser
          });
          console.log('✅ Perfil cargado:', userData);
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setMessage({ type: 'error', text: error.message });
        // Usar datos del authUser como fallback
        if (authUser) {
          const fallbackData = {
            profileImage: authUser.profileImage || null,
            userName: authUser.userName || authUser.sub || "",
            email: authUser.email || ""
          };
          setProfileData(fallbackData);
          setEditedData(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Guardar el File en editedData.profileImage para que el backend lo detecte
        setEditedData({ ...editedData, profileImage: file });
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
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Llamar directamente al servicio para obtener el error correctamente del backend
      const result = await userService.updateUser(profileData.idUser, editedData, token);
      
      if (result.success && result.data) {
        setProfileData({ ...result.data });
        setIsEditing(false);
        setImagePreview(null);
        setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
        
        // Actualizar también en Redux
        await dispatch(updateUserThunk({
          id: profileData.idUser,
          userData: editedData,
          token
        }));
        
        console.log("✅ Perfil actualizado:", result.data);
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
    setImagePreview(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="user-profile">
      {/* Background */}
      <div className="user-profile__background">
        <div className="user-profile__background-blob user-profile__background-blob--blue" />
        <div className="user-profile__background-blob user-profile__background-blob--purple" />
      </div>

      {/* Back Button */}
      {/* <button className="user-profile__back-btn" onClick={onNavigateToHome}>
        <ArrowLeft className="user-profile__back-icon" />
        Volver al Inicio
      </button> */}

      {/* Container */}
      <div className="user-profile__container">
        <div className="user-profile__card">
          {/* Header */}
          <div className="user-profile__header">
            <h1 className="user-profile__title">Mi Perfil</h1>
            <p className="user-profile__subtitle">
              Gestiona tu información personal
            </p>
          </div>

          {/* Loading State */}
          {loading && !profileData.userName && (
            <div className="user-profile__loading">
              <div className="loading-spinner"></div>
              <p>Cargando perfil...</p>
            </div>
          )}

          {/* Error State */}
          {message.text && (
            <div className={`user-profile__message user-profile__message--${message.type}`}>
              {message.type === 'success' ? (
                <Check className="user-profile__message-icon" />
              ) : (
                <X className="user-profile__message-icon" />
              )}
              {message.text}
            </div>
          )}

          {/* Not Authenticated State */}
          {!isAuthenticated && !loading && (
            <div className="user-profile__error">
              <p>🔒 Debes iniciar sesión para ver tu perfil</p>
            </div>
          )}

          {/* Profile Content */}
          {isAuthenticated && !loading && (
            <div className="user-profile__content">
              {/* Profile Image */}
              <div className="user-profile__image-section">
                <div className="user-profile__avatar-round-wrapper">
                  <Avatar
                    image={isEditing ? (imagePreview || editedData.profileImage) : profileData.profileImage}
                    name={isEditing ? editedData.userName : profileData.userName}
                    size={160}
                  />
                  {isEditing && (
                    <label className="user-profile__image-overlay user-profile__image-overlay--round">
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

                {/* Error/Success Message During Editing */}
                {message.text && isEditing && (
                  <div className={`user-profile__message user-profile__message--${message.type}`}>
                    {message.type === 'success' ? (
                      <Check className="user-profile__message-icon" />
                    ) : (
                      <X className="user-profile__message-icon" />
                    )}
                    {message.text}
                  </div>
                )}

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
                {/* Botón eliminar cuenta debajo de acciones */}
                <div className="user-profile__delete-section" style={{ marginTop: '1.5rem' }}>
                  <button
                    className="user-profile__btn user-profile__btn--delete"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    style={{ width: '100%' }}
                  >
                    {deleteLoading ? "Eliminando..." : "Eliminar cuenta"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
          }
          setShowModal(false);
        }}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.type === 'confirm' ? 'Eliminar' : 'Aceptar'}
        cancelText="Cancelar"
      />
    </div>
  );
}
