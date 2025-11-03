import React, { useEffect, useState } from 'react'
import './HomePage.css'
import HeroSection from '../../components/hero/HeroSection';
import CategoryCard from '../../components/categoryCard/CategoryCard';
import ReviewHomeCard from '../../components/review/ReviewHomeCard';
import Slider from '../../components/slider/Slider';
import Spinner from '../../components/common/Spinner';
import movieService from '../../api/services/MovieService';
import showService from '../../api/services/ShowService';
import reviewService from '../../api/services/ReviewService';
import bookService from '../../api/services/BookService';
import videogameService from '../../api/services/VideogameService';
import MediaCard from '../../components/MediaCard/MediaCard';

const ReviewService = new reviewService();

export default function HomePage() {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  
  const categories = [
    {
      title: "Películas",
      description: "Reseñas de los últimos estrenos y clásicos del cine",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG0lMjBkYXJrfGVufDF8fHx8MTc1OTc0NjE1NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Series",
      description: "Análisis de series populares y nuevos lanzamientos",
      imageUrl: "https://images.unsplash.com/photo-1607110654203-d5665bd64105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHRlbGV2aXNpb24lMjBzaG93fGVufDF8fHx8MTc1OTc0NjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Videojuegos",
      description: "Opiniones sobre los videojuegos más jugados",
      imageUrl: "https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB2aWRlb2dhbWVzJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTk3NDYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Libros",
      description: "Reseñas de bestsellers y otros libros literarios",
      imageUrl: "https://images.unsplash.com/photo-1582203914689-d5cc1850fcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHJlYWRpbmclMjBsaWJyYXJ5fGVufDF8fHx8MTc1OTY1MTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  // Función para cargar reviews reales de la base de datos
  const fetchFeaturedReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      
      const result = await ReviewService.getAllReviews();
      
      if (result.success && Array.isArray(result.data)) {
        // Ordenar por fecha (más recientes primero) y tomar las primeras 4
        const sortedReviews = result.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        // Debug: ver estructura de las reviews
        if (sortedReviews.length > 0) {
          console.log('📋 Estructura de review:', sortedReviews[0]);
          console.log('📋 Todas las keys:', Object.keys(sortedReviews[0]));
        }

        // Enriquecer reviews con datos del contenido
        const enrichedReviews = await Promise.all(
          sortedReviews.map(async (review) => {
            try {
              let contentData = null;
              const contentType = review.contentType?.toUpperCase();
              const contentId = review.contentId;

              if (!contentId || !contentType) {
                console.warn('Review sin contentId o contentType:', review);
                return review;
              }

              // Obtener datos según el tipo de contenido
              if (contentType === 'MOVIE') {
                const movieResult = await movieService.getMovieDetails(contentId);
                if (movieResult?.data) {
                  contentData = {
                    contentTitle: movieResult.data.title,
                    contentImageUrl: movieResult.data.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movieResult.data.poster_path}`
                      : ''
                  };
                }
              } else if (contentType === 'SHOW' || contentType === 'SERIES') {
                const showResult = await showService.getShowDetails(contentId);
                if (showResult?.data) {
                  contentData = {
                    contentTitle: showResult.data.name,
                    contentImageUrl: showResult.data.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${showResult.data.poster_path}`
                      : ''
                  };
                }
              } else if (contentType === 'GAME' || contentType === 'VIDEOGAME') {
                const gameResult = await videogameService.getGameById(contentId);
                if (gameResult) {
                  contentData = {
                    contentTitle: gameResult.name || 'Videojuego',
                    contentImageUrl: gameResult.cover_url || ''
                  };
                }
              } else if (contentType === 'BOOK') {
                const bookResult = await bookService.getBookById(contentId);
                if (bookResult) {
                  contentData = {
                    contentTitle: bookResult.title || 'Libro',
                    contentImageUrl: bookResult.cover_url || ''
                  };
                }
              }

              return contentData ? { ...review, ...contentData } : review;
            } catch (error) {
              console.error('Error enriqueciendo review:', error);
              return review;
            }
          })
        );
        
        setFeaturedReviews(enrichedReviews);
        console.log('✅ Reviews enriquecidas:', enrichedReviews);
      } else {
        setReviewsError('No se pudieron cargar las reviews');
        setFeaturedReviews([]);
      }
    } catch (error) {
      console.error('Error cargando reviews:', error);
      setReviewsError(error.message || 'Error al cargar reviews');
      setFeaturedReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Función para obtener contenido mixto de películas y series
  const fetchMixedPopularContent = async () => {
    try {
      const [moviesResult, showsResult] = await Promise.allSettled([
        movieService.getPopularMovies().then(res => res?.data?.results || []),
        showService.getPopularShows().then(res => res?.data?.results || [])
      ]);

      const movies = moviesResult.status === 'fulfilled' ? moviesResult.value.slice(0, 10) : [];
      const shows = showsResult.status === 'fulfilled' ? showsResult.value.slice(0, 10) : [];

  const normalizedMovies = movies.map(item => ({ ...item, contentType: 'movie' }));
  const normalizedShows = shows.map(item => ({ ...item, contentType: 'series' }));


      const allContent = [...normalizedMovies, ...normalizedShows];
      const shuffled = allContent.sort(() => Math.random() - 0.5);
      
      return shuffled;
    } catch (error) {
      console.error('Error fetching mixed content:', error);
      return [];
    }
  };

  // Función para renderizar diferentes tipos de contenido
  const renderMixedContentCard = (item) => {
    return <MediaCard item={item} type={item.contentType} className='slider-card'/>;
  };

  useEffect(() => {
    // Cargar reviews al montar el componente
    fetchFeaturedReviews();
  }, []);

  return (
    <div className="home">
      
      <HeroSection />

  {/* Slider de Películas y Series Populares */}
      <section className="slider-section">
        <div className="slider-section__container">
          <Slider
            fetchItems={fetchMixedPopularContent}
            renderItem={renderMixedContentCard}
            title="Contenido popular"
          />
        </div>
      </section>

    <section className="categories-section">
        <div className="categories-section__container">
          <h2 className="categories-section__title">Categorías</h2>
          <div className="categories-section__grid">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
                imageUrl={category.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

  {/* Featured Reviews Section */}
      <section className="featured-section">
        <div className="featured-section__container">
          <h2 className="featured-section__title">Reseñas destacadas</h2>
          
          {reviewsLoading && (
            <div className="featured-section__loading">
              <Spinner size={60} />
              <p>Cargando reseñas...</p>
            </div>
          )}

          {reviewsError && (
            <div className="featured-section__error">
              <p>❌ {reviewsError}</p>
            </div>
          )}

          {!reviewsLoading && !reviewsError && featuredReviews.length === 0 && (
            <div className="featured-section__empty">
              <p>No hay reseñas disponibles aún</p>
              <p className="featured-section__empty-subtitle">
                Sé el primero en compartir tu opinión
              </p>
            </div>
          )}

          {!reviewsLoading && !reviewsError && featuredReviews.length > 0 && (
            <div className="featured-section__grid">
              {featuredReviews.map((review) => (
                <ReviewHomeCard
                  key={review.idReview}
                  review={review}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
