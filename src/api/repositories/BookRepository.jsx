

const OPENLIB_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b/id';

class BookRepository {
	async getJson(path, params = {}, retries = 3) {
		const url = new URL(path, OPENLIB_BASE_URL);
		Object.entries(params).forEach(([k, v]) => {
			if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
		});

		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				const res = await fetch(url.toString(), {
					headers: {
						'Accept': 'application/json',
					},
					signal: AbortSignal.timeout(10000)
				});
				
				if (!res.ok) {
			
					if (res.status === 503 && attempt < retries - 1) {
						console.warn(`OpenLibrary devolvió 503, reintentando... (${attempt + 1}/${retries})`);
						await this.sleep((attempt + 1) * 1000); 
						continue;
					}
					throw new Error(`OpenLibrary error ${res.status} for ${url}`);
				}
				return res.json();
			} catch (error) {
				if (attempt < retries - 1) {
					console.warn(`Error en intento ${attempt + 1}, reintentando...`, error);
					await this.sleep((attempt + 1) * 1000);
					continue;
				}
				throw error;
			}
		}
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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

		const normalizedSubject = subject
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '_');
		const data = await this.getJson(`/subjects/${encodeURIComponent(normalizedSubject)}.json`, { limit: String(limit), offset: String(offset) });
		return data?.works || [];
	}

	async getBookByKey(workId) {
		const id = workId.includes('/works/') ? workId.split('/').pop() : workId;
		const work = await this.getJson(`/works/${id}.json`);
		

		if (work.authors && Array.isArray(work.authors)) {
			const authorPromises = work.authors.map(async (authorRef) => {
				try {
					const authorKey = authorRef.author?.key || authorRef.key;
					if (authorKey) {
						const author = await this.getAuthorByKey(authorKey);
						return author.name;
					}
				} catch (err) {
					console.error('Error fetching author:', err);
				}
				return null;
			});
			
			const authorNames = await Promise.all(authorPromises);
			work.author_name = authorNames.filter(Boolean);
		}
		
		return work;
	}

	async getAuthorByKey(authorKey) {
		const id = authorKey.includes('/authors/') ? authorKey.split('/').pop() : authorKey;
		return this.getJson(`/authors/${id}.json`);
	}
}

export default new BookRepository();

