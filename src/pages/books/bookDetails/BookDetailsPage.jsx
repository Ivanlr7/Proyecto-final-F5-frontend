import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import BookService from '../../../api/services/BookService';
import MediaCard from '../../../components/MediaCard';
import TabButton from '../../../components/common/TabButton';
import './BookDetailsPage.css';
import MediaReviews from '../../../components/review/MediaReviews';
import Spinner from '../../../components/common/Spinner';

const BookDetailsPage = () => {
	const { id } = useParams();
	const [book, setBook] = useState(null);
	const [similarBooks, setSimilarBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('details');

	const fetchBookDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await BookService.getBookById(id);
			setBook(data);
		} catch (err) {
			console.error('Error fetching book details:', err);
			if (err.message?.includes('503')) {
				setError('El servicio de OpenLibrary no está disponible temporalmente. Por favor, intenta de nuevo en unos minutos.');
			} else if (err.message?.includes('NetworkError') || err.name === 'TypeError') {
				setError('Error de conexión con OpenLibrary. Verifica tu conexión a internet e intenta de nuevo.');
			} else {
				setError('Error al cargar los detalles del libro.');
			}
		} finally {
			setLoading(false);
		}
	}, [id]);

	const fetchSimilarBooks = useCallback(async () => {
		if (!book) return;
		try {
			const data = await BookService.getSimilarBooks(book);
			setSimilarBooks(data);
		} catch (err) {
			console.error('Error fetching similar books:', err);
		}
	}, [book]);

	useEffect(() => {
		fetchBookDetails();
	}, [fetchBookDetails]);

	useEffect(() => {
		if (book && activeTab === 'suggestions') {
			fetchSimilarBooks();
		}
	}, [activeTab, book, fetchSimilarBooks]);

	if (loading) {
		return (
			<div className="books-page__loading">
				<Spinner size={48} />
				<p>Cargando detalles del libro...</p>
			</div>
		);
	}

	if (error || !book) {
		return (
			<div className="book-details">
				<div className="error-container">
					<h2>Error</h2>
					<p>{error || 'No se encontró el libro.'}</p>
				</div>
			</div>
		);
	}

	return (
			<div className="book-details">
				<div 
					className="book-details__hero"
					style={{
						backgroundImage: book.backdrop_url 
							? `url(${book.backdrop_url})`
							: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
					}}
				>
					<div className="book-details__hero-overlay" />
					<div className="book-details__hero-content">
					<div className="book-details__poster-container">
						{book.cover_url || book.poster_url ? (
							<img 
								src={book.cover_url || book.poster_url} 
								alt={book.title || book.name}
								className="book-details__poster"
								onError={(e) => {
									e.target.style.display = 'none';
									e.target.nextSibling.style.display = 'flex';
								}}
							/>
						) : null}
						<div 
							className="book-details__poster-fallback" 
							style={{ display: (book.cover_url || book.poster_url) ? 'none' : 'flex' }}
						>
							📚
						</div>
					</div>
          
					<div className="book-details__info">
						<h1 className="book-details__title">{book.title || book.name}</h1>
            
						{book.author_name && book.author_name.length > 0 && (
							<p className="book-details__original-title">
								por {book.author_name.join(', ')}
							</p>
						)}
            
						<div className="book-details__meta">
							{book.release_year && (
								<span className="book-details__meta-item">📅 {book.release_year}</span>
							)}
							{book.vote_average > 0 && (
								<span className="book-details__rating">⭐ {book.vote_average.toFixed(1)}/5</span>
							)}
							{book.edition_count && (
								<span className="book-details__meta-item">📚 {book.edition_count} ediciones</span>
							)}
						</div>

						{book.subjects && book.subjects.length > 0 && (
							<div className="book-details__genres">
								{book.subjects.slice(0, 6).map((subject, index) => (
									<span key={index} className="book-details__genre">
										{subject}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="book-details__container book-details__content">
						<div className="book-details__tabs" style={{ marginTop: '2rem' }}>
							<TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
								DETALLES
							</TabButton>
							<TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
								RESEÑAS
							</TabButton>
							<TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')}>
								SUGERENCIAS
							</TabButton>
						</div>

				<div className="book-details__content">
								{activeTab === 'details' && (
						<div className="book-details__details">
					
										{book.overview && (
											<div className="book-details__section" style={{marginTop: '1rem'}}>
												<h3 className="book-details__section-title">Sinopsis</h3>
												<p className="book-details__overview">{book.overview}</p>
											</div>
										)}
              
							<div className="book-details__info-grid">
								{book.author_name && book.author_name.length > 0 && (
									<div className="book-details__info-item">
										<strong>Autor/a:</strong>
										<span>{book.author_name.join(', ')}</span>
									</div>
								)}
								{book.publisher && book.publisher.length > 0 && (
									<div className="book-details__info-item">
										<strong>Editorial:</strong>
										<span>{book.publisher.join(', ')}</span>
									</div>
								)}
								{book.isbn && book.isbn.length > 0 && (
									<div className="book-details__info-item">
										<strong>ISBN:</strong>
										<span>{book.isbn[0]}</span>
									</div>
								)}
								{book.first_publish_year && (
									<div className="book-details__info-item">
										<strong>Primera Publicación:</strong>
										<span>{book.first_publish_year}</span>
									</div>
								)}
								{book.edition_count && (
									<div className="book-details__info-item">
										<strong>Ediciones:</strong>
										<span>{book.edition_count}</span>
									</div>
								)}
								{book.language && book.language.length > 0 && (
									<div className="book-details__info-item">
										<strong>Idioma:</strong>
										<span>{book.language.join(', ').toUpperCase()}</span>
									</div>
								)}
								{book.number_of_pages_median && (
									<div className="book-details__info-item">
										<strong>Páginas:</strong>
										<span>{book.number_of_pages_median}</span>
									</div>
								)}
							</div>

							{book.subjects && book.subjects.length > 0 && (
								<div className="book-details__section">
									<h3 className="book-details__section-title">Temas y Géneros</h3>
									<div className="book-details__genres">
										{book.subjects.map((subject, index) => (
											<span key={index} className="book-details__genre">
												{subject}
											</span>
										))}
									</div>
								</div>
							)}

							{book.person && book.person.length > 0 && (
								<div className="book-details__section">
									<h3 className="book-details__section-title">Personajes Históricos</h3>
									<div className="book-details__genres">
										{book.person.map((p, index) => (
											<span key={index} className="book-details__genre">{p}</span>
										))}
									</div>
								</div>
							)}

							{book.place && book.place.length > 0 && (
								<div className="book-details__section">
									<h3 className="book-details__section-title">Lugares</h3>
									<div className="book-details__genres">
										{book.place.map((pl, index) => (
											<span key={index} className="book-details__genre">{pl}</span>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === 'reviews' && (
						<div className="book-details__reviews">
						<MediaReviews contentType="BOOK" contentId={id} apiSource="OPENLIBRARY" />
						</div>
					)}

					{activeTab === 'suggestions' && (
						<div className="book-details__suggestions">
							<h2 className="book-details__section-title">Libros Similares</h2>
							{similarBooks.length > 0 ? (
								  <div className="book-details__suggested-list">
									{similarBooks.map((similarBook) => (
										<MediaCard key={similarBook.id} item={similarBook} type="book" />
									))}
								</div>
							) : (
								<div className="book-details__review">
									<p>No se encontraron libros similares.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookDetailsPage;

