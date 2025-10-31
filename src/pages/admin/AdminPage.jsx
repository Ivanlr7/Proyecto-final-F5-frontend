import Avatar from "../../components/common/Avatar";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserThunk } from "../../store/slices/authSlice";
import userService from "../../api/services/UserService";
import { ArrowLeft, Edit2, Trash2, Save, X, User, Mail, Search } from "lucide-react";
import "./AdminPage.css";

export default function AdminPage({ onNavigateToHome }) {
  // Usuarios reales desde el backend
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const dispatch = useDispatch();
  const { token, user: authUser } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const result = await userService.getAllUsers(token);
        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          setErrorUsers(result.message || "Error al cargar usuarios");
        }
      } catch (err) {
        setErrorUsers(err.message || "Error al cargar usuarios");
      } finally {
        setLoadingUsers(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({
    userName: "",
    email: "",
    profileImage: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingUser(user.idUser);
    setEditedData({
      userName: user.userName,
      email: user.email,
      profileImage: user.profileImage
    });
    setImagePreview(null);
  };

  const handleSave = async (userId) => {
    try {
      const userData = {
        userName: editedData.userName,
        email: editedData.email,
        profileImage: editedData.profileImage
      };
      const result = await userService.updateUser(userId, userData, token);
      if (result.success && result.data) {
        setUsers(users.map(user => user.idUser === userId ? result.data : user));
        // Si el usuario editado es el autenticado, actualizar también en Redux
        if (authUser && userId === authUser.idUser) {
          await dispatch(updateUserThunk({ id: userId, userData, token }));
        }
      }
      setEditingUser(null);
      setEditedData({ userName: "", email: "", profileImage: "" });
      setImagePreview(null);
    } catch (err) {
      alert(err.message || "Error al actualizar usuario");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditedData({ userName: "", email: "", profileImage: "" });
    setImagePreview(null);
  };
  // Manejar cambio de imagen (file input)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedData({ ...editedData, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.idUser, token);
        setUsers(users.filter(user => user.idUser !== userToDelete.idUser));
      } catch (err) {
        alert(err.message || "Error al eliminar usuario");
      }
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  return (
    <div className="admin-page">
      {/* Animated Background */}
      <div className="admin-page__background">
        <div className="admin-page__background-blob admin-page__background-blob--blue"></div>
        <div className="admin-page__background-blob admin-page__background-blob--purple"></div>
      </div>

      {/* Back Button */}
      {/* <button className="admin-page__back-btn" onClick={onNavigateToHome}>
        <ArrowLeft className="admin-page__back-icon" />
      </button> */}

      {/* Main Content */}
      <div className="admin-page__content">
        {/* Header */}
        <div className="admin-page__header">
          <div className="admin-page__header-text">
            <h1 className="admin-page__title">Administración de Usuarios</h1>
            <p className="admin-page__subtitle">
              Gestiona todos los usuarios de la plataforma
            </p>
          </div>
          <div className="admin-page__stats">
            <div className="admin-page__stat-card">
              <div className="admin-page__stat-value">{users.length}</div>
              <div className="admin-page__stat-label">Total Usuarios</div>
            </div>
            <div className="admin-page__stat-card">
              <div className="admin-page__stat-value">{filteredUsers.length}</div>
              <div className="admin-page__stat-label">Mostrando</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="admin-page__search-container">
          <div className="admin-page__search-wrapper">
            <Search className="admin-page__search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-page__search-input"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-page__table-container">
          {loadingUsers ? (
            <div className="admin-page__loading">Cargando usuarios...</div>
          ) : errorUsers ? (
            <div className="admin-page__error">{errorUsers}</div>
          ) : (
          <table className="admin-page__table">
            <thead className="admin-page__table-header">
              <tr>
                <th className="admin-page__table-th">ID</th>
                <th className="admin-page__table-th">Avatar</th>
                <th className="admin-page__table-th">Usuario</th>
                <th className="admin-page__table-th">Email</th>
                <th className="admin-page__table-th">Acciones</th>
              </tr>
            </thead>
            <tbody className="admin-page__table-body">
              {filteredUsers.map((user) => (
                <tr key={user.idUser} className="admin-page__table-row">
                  <td className="admin-page__table-td admin-page__table-td--id">
                    {user.idUser}
                  </td>
                  {/* Avatar cell */}
                  <td className="admin-page__table-td">
                    {editingUser === user.idUser ? (
                      <Avatar
                        image={imagePreview || editedData.profileImage}
                        name={editedData.userName || editedData.email || 'U'}
                        size={70}
                        editable={true}
                        onImageChange={handleImageChange}
                        style={{ margin: 0 }}
                      />
                    ) : (
                      <div className="admin-page__user-avatar-wrapper" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        {userService.getImageUrl(user.profileImage) ? (
                          <img
                            src={userService.getImageUrl(user.profileImage)}
                            alt={user.userName}
                            className="admin-page__user-avatar"
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="admin-page__user-avatar-initials"
                          style={{
                            display: userService.getImageUrl(user.profileImage) ? 'none' : 'flex',
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            borderRadius: '50%'
                          }}
                        >
                          {(user.userName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* Username cell */}
                  <td className="admin-page__table-td">
                    {editingUser === user.idUser ? (
                      <div className="admin-page__edit-field-group">
                        <label className="admin-page__edit-label">
                          <User className="admin-page__edit-label-icon" />
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="userName"
                          value={editedData.userName}
                          onChange={handleInputChange}
                          className="admin-page__edit-input"
                        />
                      </div>
                    ) : (
                      <span className="admin-page__user-name">{user.userName}</span>
                    )}
                  </td>
                  <td className="admin-page__table-td">
                    {editingUser === user.idUser ? (
                      <div className="admin-page__edit-field-group">
                        <label className="admin-page__edit-label">
                          <Mail className="admin-page__edit-label-icon" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editedData.email}
                          onChange={handleInputChange}
                          className="admin-page__edit-input"
                        />
                      </div>
                    ) : (
                      <span className="admin-page__user-email">{user.email}</span>
                    )}
                  </td>
                  <td className="admin-page__table-td admin-page__table-td--actions">
                    {editingUser === user.idUser ? (
                      <div className="admin-page__actions">
                        <button
                          onClick={() => handleSave(user.idUser)}
                          className="admin-page__action-btn admin-page__action-btn--save"
                          title="Guardar cambios"
                        >
                          <Save className="admin-page__action-icon" />
                          <span className="admin-page__action-text">Guardar</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="admin-page__action-btn admin-page__action-btn--cancel"
                          title="Cancelar"
                        >
                          <X className="admin-page__action-icon" />
                          <span className="admin-page__action-text">Cancelar</span>
                        </button>
                      </div>
                    ) : (
                      <div className="admin-page__actions">
                        <button
                          onClick={() => handleEdit(user)}
                          className="admin-page__action-btn admin-page__action-btn--edit"
                          title="Editar usuario"
                        >
                          <Edit2 className="admin-page__action-icon" />
                          <span className="admin-page__action-text">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="admin-page__action-btn admin-page__action-btn--delete"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="admin-page__action-icon" />
                          <span className="admin-page__action-text">Eliminar</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          {!loadingUsers && !errorUsers && filteredUsers.length === 0 && (
            <div className="admin-page__empty-state">
              <p className="admin-page__empty-text">
                No se encontraron usuarios con el término "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-page__modal-overlay" onClick={handleDeleteCancel}>
          <div className="admin-page__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-page__modal-header">
              <h2 className="admin-page__modal-title">Confirmar Eliminación</h2>
            </div>
            <div className="admin-page__modal-content">
              <p className="admin-page__modal-text">
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <strong>{userToDelete?.userName}</strong>?
              </p>
              <p className="admin-page__modal-subtext">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="admin-page__modal-actions">
              <button
                onClick={handleDeleteCancel}
                className="admin-page__modal-btn admin-page__modal-btn--cancel"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="admin-page__modal-btn admin-page__modal-btn--delete"
              >
                <Trash2 className="admin-page__modal-btn-icon" />
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
