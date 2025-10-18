// OpenLibrary data access layer
// Docs: https://openlibrary.org/developers/api

const OPENLIB_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b/id';

class BookRepository {
	async getJson(path, params = {}) {
		const url = new URL(path, OPENLIB_BASE_URL);
		Object.entries(params).forEach(([k, v]) => {
			if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
		});

		const res = await fetch(url.toString());
		if (!res.ok) {
			throw new Error(`OpenLibrary error ${res.status} for ${url}`);
		}
		return res.json();
	}

	getCoverUrl(coverId, size = 'L') {
		if (!coverId) return null;
		return `${COVERS_BASE_URL}/${coverId}-${size}.jpg`;
	}

	async searchBooks(query, page = 1) {
		const params = { q: query || '', page: String(page), limit: '20' };
		const data = await this.getJson('/search.json', params);
		return data?.docs || [];
	}

	async getPopularBooks(page = 1) {
		const limit = 20;
		const offset = (page - 1) * limit;
		const data = await this.getJson('/trending/daily.json', { limit: String(limit), offset: String(offset) });
		return data?.works || [];
	}

	async getRecentBooks(page = 1) {
		const params = { q: '*', page: String(page), limit: '20', sort: 'new' };
		const data = await this.getJson('/search.json', params);
		return data?.docs || [];
	}

	async getClassicBooks(page = 1) {
		return this.getBooksBySubject('classics', page);
	}

	async getBestsellerBooks(page = 1) {
		return this.getBooksBySubject('bestsellers', page);
	}

	async getBooksBySubject(subject, page = 1) {
		const limit = 20;
		const offset = (page - 1) * limit;
		const data = await this.getJson(`/subjects/${encodeURIComponent(subject)}.json`, { limit: String(limit), offset: String(offset) });
		return data?.works || [];
	}

	async getBookByKey(workId) {
		const id = workId.includes('/works/') ? workId.split('/').pop() : workId;
		return this.getJson(`/works/${id}.json`);
	}

	async getAuthorByKey(authorKey) {
		const id = authorKey.includes('/authors/') ? authorKey.split('/').pop() : authorKey;
		return this.getJson(`/authors/${id}.json`);
	}
}

export default new BookRepository();

