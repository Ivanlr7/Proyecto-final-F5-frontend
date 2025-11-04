import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookService from '../../../api/services/BookService';
import MediaCard from '../../../components/MediaCard';
import SearchBar from '../../../components/SearchBar/SearchBar';
import AdvancedFilterToggle from '../../../components/common/AdvancedFilterToggle';
import Spinner from '../../../components/common/Spinner';
import Pagination from '../../../components/common/Pagination';
import CategoryButton from '../../../components/common/CategoryButton';
import './BooksPage.css';

const BooksPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [activeFilter, setActiveFilter] = useState('popular');
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedYear, setSelectedYear] = useState('');
	const [selectedRating, setSelectedRating] = useState('');
	const [totalPages, setTotalPages] = useState(1);

	const subjects = [
		{ id: '', name: 'Todos los géneros' },
		{ id: 'fiction', name: 'Ficción' },
		{ id: 'fantasy', name: 'Fantasía' },
		{ id: 'science fiction', name: 'Ciencia Ficción' },
		{ id: 'mystery', name: 'Misterio' },
		{ id: 'thriller', name: 'Thriller' },
		{ id: 'romance', name: 'Romance' },
		{ id: 'horror', name: 'Terror' },
		{ id: 'biography', name: 'Biografía' },
		{ id: 'history', name: 'Historia' },
		{ id: 'philosophy', name: 'Filosofía' },
		{ id: 'poetry', name: 'Poesía' },
		{ id: 'science', name: 'Ciencia' }
	];

	const ratings = [
		{ id: '', name: 'Todas las valoraciones' },
		{ id: '4.5', name: '4.5+ ⭐' },
		{ id: '4', name: '4+ ⭐' },
		{ id: '3.5', name: '3.5+ ⭐' },
		{ id: '3', name: '3+ ⭐' }
	];

	const currentYear = new Date().getFullYear();
	const years = [
		{ id: '', name: 'Todos los años' },
		{ id: currentYear.toString(), name: currentYear.toString() },
		{ id: (currentYear - 1).toString(), name: (currentYear - 1).toString() },
		{ id: (currentYear - 2).toString(), name: (currentYear - 2).toString() },
		{ id: '2020-2024', name: '2020-2024' },
		{ id: '2010-2019', name: '2010-2019' },
		{ id: '2000-2009', name: '2000-2009' },
		{ id: '1900-1999', name: 'Siglo XX' }
	];

	const fetchBooks = useCallback(async (query = null) => {
		try {
			setLoading(true);
			setError(null);
			let data;
			if (query || (activeFilter === 'search' && searchQuery)) {
				data = await BookService.searchBooks(query || searchQuery, currentPage);
			} else if (activeFilter === 'recent') {
				data = await BookService.getRecentBooks(currentPage);
			} else if (activeFilter === 'classic') {
				data = await BookService.getClassicBooks(currentPage);
			} else if (activeFilter === 'bestseller') {
				data = await BookService.getBestsellerBooks(currentPage);
			} else if (selectedSubject) {
				data = await BookService.getBooksBySubject(selectedSubject, currentPage);
			} else {
				data = await BookService.getPopularBooks(currentPage);
			}

			if (selectedRating || selectedYear) {
				data = data.filter(book => {
					let passes = true;
					if (selectedRating) {
						passes = passes && (book.vote_average || 0) >= parseFloat(selectedRating);
					}
					if (selectedYear) {
						const bookYear = book.release_year || book.first_publish_year;
						if (!bookYear) return false;
						if (selectedYear.includes('-')) {
							const [start, end] = selectedYear.split('-').map(Number);
							passes = passes && bookYear >= start && bookYear <= end;
						} else {
							passes = passes && bookYear === parseInt(selectedYear);
						}
					}
					return passes;
				});
			}

			setBooks(data);
		} catch (err) {
			console.error('Error fetching books:', err);
			setError('Error al cargar los libros. Por favor, intenta de nuevo.');
		} finally {
			setLoading(false);
		}
	}, [currentPage, activeFilter, searchQuery, selectedSubject, selectedRating, selectedYear]);

	useEffect(() => {
		const query = searchParams.get('search');
		if (query) {
			setSearchQuery(query);
			setActiveFilter('search');
		}
	}, [searchParams]);

	useEffect(() => {
		fetchBooks();
	}, [fetchBooks]);

	useEffect(() => {

		if (books.length === 20) {
			setTotalPages(currentPage + 1);
		} else {
			setTotalPages(currentPage);
		}
	}, [books, currentPage]);

	const handleSearchSubmit = (query) => {
		setSearchQuery(query);
		setSearchParams({ search: query });
		setActiveFilter('search');
		setCurrentPage(1);
		fetchBooks(query);
	};

	const handleClearSearch = () => {
		setSearchQuery('');
		setSearchParams({});
		setActiveFilter('popular');
		setCurrentPage(1);
		fetchBooks('');
	};

	const handleFilterChange = (filter) => {
		setActiveFilter(filter);
		setCurrentPage(1);
		setSearchParams({});
		setSearchQuery('');
		setSelectedSubject('');
	};

	const handleClearAdvancedFilters = () => {
		setSelectedSubject('');
		setSelectedRating('');
		setSelectedYear('');
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (loading && books.length === 0) {
		return (
			<div className="books-page__loading">
				<Spinner size={48} />
				<p>Cargando libros...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="books-page">
				<div className="books-page__error">
					<h2>Error</h2>
					<p>{error}</p>
					<button onClick={() => fetchBooks()} className="books-page__retry-btn">
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="books-page">
			<div className="books-page__container">
				<div className="books-page__header">
					<h1 className="books-page__title">Libros</h1>
				</div>

				<SearchBar 
					onSearch={handleSearchSubmit}
					onClear={handleClearSearch}
					isSearching={activeFilter === 'search'}
					searchQuery={searchQuery}
					placeholder="Buscar libros por título o autor..."
				/>

				<div className="books-page__filters">
					<div className="books-page__categories">
						<CategoryButton
							active={activeFilter === 'popular'}
							onClick={() => handleFilterChange('popular')}
						>
							Populares
						</CategoryButton>
						<CategoryButton
							active={activeFilter === 'classic'}
							onClick={() => handleFilterChange('classic')}
						>
							Clásicos
						</CategoryButton>
						<CategoryButton
							active={activeFilter === 'bestseller'}
							onClick={() => handleFilterChange('bestseller')}
						>
							Bestsellers
						</CategoryButton>
					</div>
				</div>

				   <div className="books-page__advanced-toggle">
					   <AdvancedFilterToggle open={showAdvancedFilters} onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} />
				   </div>

				{showAdvancedFilters && (
					<div className="books-page__advanced-filters">
						<div className="books-page__filters-title">
							<h3>Filtros avanzados</h3>
							{(selectedSubject || selectedRating || selectedYear) && (
								<button 
									className="books-page__clear-filters"
									onClick={handleClearAdvancedFilters}
								>
									Limpiar filtros
								</button>
							)}
						</div>

						<div className="books-page__filters-grid">
							<div className="filter-group">
								<label htmlFor="subject-filter">Género</label>
								<div className="books-page__select-wrapper">
									<select 
										id="subject-filter"
										value={selectedSubject}
										onChange={(e) => {
											setSelectedSubject(e.target.value);
											setActiveFilter('');
										}}
										className="filter-select"
									>
										{subjects.map(subject => (
											<option key={subject.id} value={subject.id}>
												{subject.name}
											</option>
										))}
									</select>
									<span className="books-page__select-arrow">▼</span>
								</div>
							</div>

							<div className="filter-group">
								<label htmlFor="rating-filter">Valoración</label>
								<div className="books-page__select-wrapper">
									<select 
										id="rating-filter"
										value={selectedRating}
										onChange={(e) => setSelectedRating(e.target.value)}
										className="filter-select"
									>
										{ratings.map(rating => (
											<option key={rating.id} value={rating.id}>
												{rating.name}
											</option>
										))}
									</select>
									<span className="books-page__select-arrow">▼</span>
								</div>
							</div>

							<div className="filter-group">
								<label htmlFor="year-filter">Año de Publicación</label>
								<div className="books-page__select-wrapper">
									<select 
										id="year-filter"
										value={selectedYear}
										onChange={(e) => setSelectedYear(e.target.value)}
										className="filter-select"
									>
										{years.map(year => (
											<option key={year.id} value={year.id}>
												{year.name}
											</option>
										))}
									</select>
									<span className="books-page__select-arrow">▼</span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="books-page__grid">
					{books.map((book) => (
						<MediaCard key={book.id} item={book} type="book" />
					))}
				</div>

				{books.length === 0 && (
					<div className="books-page__empty">
						<p>No se encontraron libros con los filtros seleccionados.</p>
					</div>
				)}

				<div className="books-page__pagination">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default BooksPage;

