
import React, { useEffect, useState } from 'react';
import ListService from '../../api/services/ListService';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './ListPage.css';
import Avatar from '../../components/common/Avatar';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EditButton from '../../components/common/EditButton';
import DeleteButton from '../../components/common/DeleteButton';

const listService = new ListService();

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=';

const ListPage = () => {
  const { token, isAuthenticated } = useSelector(state => state.auth);
  const authUser = useSelector(state => state.auth?.user);
  const userRole = useSelector(state => state.auth?.role);
  const [listsWithDetails, setListsWithDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'alert',
    title: '',
    message: '',
    onConfirm: null
  });

  // Función para mostrar modal
  const showModalMessage = (type, title, message, onConfirm = null) => {
    setModalConfig({ type, title, message, onConfirm });
    setShowModal(true);
  };

  // Función para manejar la edición de lista
  const handleEditList = (list) => {
    if (!isAuthenticated || !token) {
      showModalMessage('alert', 'Autenticación requerida', 'Debes iniciar sesión para editar una lista');
      return;
    }

    navigate('/listas/crear', { state: { editingList: list } });
  };

  // Función para manejar la eliminación de lista
  const handleDeleteList = async (listId) => {
    if (!isAuthenticated || !token) {
      showModalMessage('alert', 'Autenticación requerida', 'Debes iniciar sesión para eliminar una lista');
      return;
    }

    showModalMessage(
      'confirm',
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.',
      async () => {
        const res = await listService.deleteList(listId, token);
        if (res.success) {

          setListsWithDetails(prev => prev.filter(list => (list.idList || list.id) !== listId));
          showModalMessage('alert', 'Éxito', 'Lista eliminada correctamente');
        } else {
          showModalMessage('error', 'Error', res.error || 'Error al eliminar la lista');
        }
      }
    );
  };

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      const res = await listService.getAllLists();
      if (res.success) {

        const listsDetails = await Promise.all(res.data.map(async (list) => {
          if (list.items && list.items.length > 0) {
            const fetchers = list.items.slice(0, 4).map(async (item) => {
              const type = (item.contentType || '').toLowerCase();
              const contentId = item.contentId;
              try {
                if (type === 'movie') {
                  const r = await MovieService.getMovieDetails(contentId);
                  return { ...r.data, type: 'movie' };
                } else if (type === 'series') {
                  const r = await ShowService.getShowDetails(contentId);
                  return { ...r.data, type: 'series' };
                } else if (type === 'book') {
                  const r = await BookService.getBookById ? await BookService.getBookById(contentId) : null;
                  return r ? { ...r, type: 'book' } : { id: contentId, type: 'book' };
                } else if (type === 'game' || type === 'videogame') {
                  const r = await VideogameService.getGameById(contentId);
                  return { ...r, type: 'videogame' };
                } else {
                  return { id: contentId, type };
                }
              } catch {
                return { id: contentId, type };
              }
            });
            const details = await Promise.all(fetchers);
            return { ...list, detailedItems: details };
          } else {
            return { ...list, detailedItems: [] };
          }
        }));
        setListsWithDetails(listsDetails);
      } else setError(res.error);
      setLoading(false);
    };
    fetchLists();
  }, []);

  return (
    <div className="list-page">
      <h1 className="list-page__title">Listas</h1>
      <button 
        className="list-page__create-btn" 
        onClick={(e) => {
          e.preventDefault();
          if (isAuthenticated !== true || !token) {
            showModalMessage('alert', 'Autenticación requerida', 'Debes iniciar sesión para crear una lista');
            return;
          }
          navigate('/listas/crear');
        }}
      >
        Crear nueva lista
      </button>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Spinner size={60} />
        </div>
      ) : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div className="list-page__lists">
          {listsWithDetails.map(list => {

            const listUserId = list.idUser || list.userId;
            const currentUserId = authUser?.userId || authUser?.id;
            const isOwnList = isAuthenticated && currentUserId && String(listUserId) === String(currentUserId);
            const isAdmin = isAuthenticated && (Array.isArray(userRole) ? userRole.includes('admin') : userRole === 'admin');
            const canModify = isOwnList || isAdmin;

            return (
              <div key={list.id} className="list-card">
                <div className="list-card__covers">
                  {(list.detailedItems && list.detailedItems.length > 0 ? list.detailedItems : [null, null, null, null]).slice(0, 4).map((item, idx) => (
                    <div key={idx} className="list-card__cover" style={{ zIndex: 10 - idx }}>
                      {item ? (
                        <div className="list-card__cover-img-wrapper">
                          <img
                            src={item.poster_url || item.cover_url || item.backdrop_url || item.screenshot_url || item.image || item.img || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fit=crop&w=400&q=80'}
                            alt={item.title || item.name || ''}
                            className="list-card__cover-img"
                          />
              
                        </div>
                      ) : (
                        <div className="list-card__placeholder">?</div>
                      )}
                    </div>
                  ))}
                </div>
                <h3 className="list-card__name">
                  <Link to={`/listas/${list.idList || list.id}`}>{list.title || list.name}</Link>
                </h3>
                <div className="list-card__author">
                  <Avatar
                    image={list.userProfileImageUrl}
                    name={list.userName || 'U'}
                    size={28}
                    className="list-card__avatar"
                  />
                  <span className="list-card__author-label">Creada por <b>{list.userName || 'Usuario'}</b></span>
                </div>
                
                {canModify && (
                  <div className="list-card__actions">
                    <EditButton onClick={() => handleEditList(list)} />
                    <DeleteButton onClick={() => handleDeleteList(list.idList || list.id)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
        confirmText={modalConfig.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ListPage;
