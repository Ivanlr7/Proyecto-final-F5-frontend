import BookRepository from '../repositories/BookRepository';

class BookService {
	formatBook(raw) {
		if (!raw) return null;

		const id = (raw.key || raw.cover_edition_key || raw.edition_key?.[0] || '').replace('/works/', '').replace('/books/', '') || raw.id;
		const title = raw.title || raw.name;
		const coverId = raw.cover_i || raw.cover_id || raw.covers?.[0];
		const cover_url = coverId ? BookRepository.getCoverUrl(coverId, 'L') : null;
		const poster_url = coverId ? BookRepository.getCoverUrl(coverId, 'M') : null;
		const backdrop_url = coverId ? BookRepository.getCoverUrl(coverId, 'L') : null;

		const authors = raw.author_name || raw.authors?.map(a => a.name).filter(Boolean) || [];
	
		let subjects = [];
		if (Array.isArray(raw.subject)) {
			subjects = raw.subject;
		} else if (Array.isArray(raw.subjects)) {
			subjects = raw.subjects.map(s => {
				if (typeof s === 'string') return s;
				if (s.key) return s.key.replace('/subjects/', '');
				return null;
			}).filter(Boolean);
		}
		const publisher = raw.publisher || raw.publishers || [];
		const language = raw.language || raw.languages?.map(l => l.key?.split('/').pop()) || [];
		const first_publish_year = raw.first_publish_year || raw.first_publish_date || raw.created?.value?.slice(0,4);
		const release_year = typeof first_publish_year === 'string' ? parseInt(first_publish_year) : first_publish_year;
		// Mock para el rating si no vienen en la petición
		let vote_average = raw.ratings_average ? Number(raw.ratings_average) : (raw.rating || 0);
		if (!vote_average) {
			vote_average = Math.round((Math.random() * 4 + 6) * 10) / 10;
		}
		const overview = raw.description?.value || raw.description || raw.subtitle || '';
		const edition_count = raw.edition_count;
		const number_of_pages_median = raw.number_of_pages_median || raw.number_of_pages;
		const isbn = raw.isbn || raw.isbn13 || raw.isbn10 || [];
		
	
		const person = Array.isArray(raw.person) 
			? raw.person.map(p => typeof p === 'string' ? p : (p.key?.replace('/subjects/', '') || null)).filter(Boolean)
			: [];
		const place = Array.isArray(raw.place)
			? raw.place.map(p => typeof p === 'string' ? p : (p.key?.replace('/subjects/', '') || null)).filter(Boolean)
			: [];

		return {
			id,
			title,
			name: title,
			cover_url,
			poster_url,
			backdrop_url,
			author_name: authors,
			subjects,
			publisher,
			language,
			first_publish_year,
			release_year,
			overview,
			vote_average,
			edition_count,
			number_of_pages_median,
			isbn: Array.isArray(isbn) ? isbn : [isbn].filter(Boolean),
			person,
			place,
			raw
		};
	}

	async searchBooks(query, page = 1) {
		const docs = await BookRepository.searchBooks(query, page);
		return docs.map(doc => this.formatBook(doc)).filter(Boolean);
	}

	async getPopularBooks(page = 1) {
		try {
			const works = await BookRepository.getPopularBooks(page);
			return works.map(w => this.formatBook(w)).filter(Boolean);
		} catch (error) {
	
			console.warn('Trending endpoint falló, usando fallback...', error);
			try {
				const works = await BookRepository.getBooksBySubject('fiction', page);
				return works.map(w => this.formatBook(w)).filter(Boolean);
			} catch (fallbackError) {
				console.error('Fallback también falló:', fallbackError);
				throw fallbackError;
			}
		}
	}

	async getRecentBooks(page = 1) {
		const docs = await BookRepository.getRecentBooks(page);
		return docs.map(doc => this.formatBook(doc)).filter(Boolean);
	}

	async getClassicBooks(page = 1) {
		const works = await BookRepository.getClassicBooks(page);
		return works.map(w => this.formatBook(w)).filter(Boolean);
	}

	async getBestsellerBooks(page = 1) {
		const works = await BookRepository.getBestsellerBooks(page);
		return works.map(w => this.formatBook(w)).filter(Boolean);
	}

	async getBooksBySubject(subject, page = 1) {
		const works = await BookRepository.getBooksBySubject(subject, page);
		return works.map(w => this.formatBook(w)).filter(Boolean);
	}

	async getBookById(id) {
		const work = await BookRepository.getBookByKey(id);
		return this.formatBook(work);
	}

	async getSimilarBooks(book, page = 1) {
		const subject = book?.subjects?.[0];
		if (subject) {
			const works = await BookRepository.getBooksBySubject(subject, page);
			const formatted = works.map(w => this.formatBook(w)).filter(Boolean);
			return formatted.filter(b => b.id !== book.id).slice(0, 10);
		}
		if (book?.title) {
			const docs = await BookRepository.searchBooks(book.title.split(':')[0], 1);
			const formatted = docs.map(d => this.formatBook(d)).filter(Boolean);
			return formatted.filter(b => b.id !== book.id).slice(0, 10);
		}
		return [];
	}
}

export default new BookService();

