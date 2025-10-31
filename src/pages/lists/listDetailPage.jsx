import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListService from '../../api/services/ListService';
import MediaCard from '../../components/MediaCard/MediaCard';
import MovieService from '../../api/services/MovieService';
import ShowService from '../../api/services/ShowService';
import BookService from '../../api/services/BookService';
import VideogameService from '../../api/services/VideogameService';
import './listDetailPage.css';
import Avatar from '../../components/common/Avatar';

const ListDetailPage = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedItems, setDetailedItems] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      const service = new ListService();
      const res = await service.getListById(id);
      if (res.success) {
        setList(res.data);
        // Buscar detalles de cada item
        if (res.data.items && res.data.items.length > 0) {
          const fetchers = res.data.items.map(async (item) => {
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
          setDetailedItems(details);
        } else {
          setDetailedItems([]);
        }
      } else setError(res.error);
      setLoading(false);
    };
    fetchList();
  }, [id]);

  if (loading) return <div className="list-detail-page">Cargando...</div>;
  if (error) return <div className="list-detail-page" style={{color:'red'}}>{error}</div>;
  if (!list) return null;

  return (
    <div className="list-detail-page">
      <h1 className="list-detail-page__title">{list.title}</h1>
      <div className="list-detail-page__meta">
        <Avatar
          image={list.userProfileImageUrl}
          name={list.userName || 'U'}
          size={36}
          className="list-detail-page__avatar"
        />
        <span className="list-detail-page__author">Creada por <b>{list.userName || 'Usuario'}</b></span>
        <span className="list-detail-page__desc">{list.description}</span>
      </div>
      <div className="list-detail-page__grid">
        {detailedItems.length > 0 ? (
          detailedItems.map(item => (
            <MediaCard key={item.id + item.type} item={item} type={item.type} />
          ))
        ) : (
          <div>No hay elementos en esta lista.</div>
        )}
      </div>
    </div>
  );
};

export default ListDetailPage;
