import { describe, it, expect, vi, beforeEach } from 'vitest';
import bookRepository from '../../src/api/repositories/BookRepository';

describe('BookRepository integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('searchBooks realiza búsqueda correcta', async () => {
    const mockResponse = {
      docs: [
        { key: '/works/123', title: 'Test Book', author_name: ['Author'] }
      ]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.searchBooks('test', 1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/search.json?q=test&page=1&limit=20')
    );
    expect(result).toEqual(mockResponse.docs);
  });

  it('getPopularBooks obtiene libros populares', async () => {
    const mockResponse = {
      works: [
        { key: '/works/456', title: 'Popular Book' }
      ]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.getPopularBooks(1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/trending/daily.json')
    );
    expect(result).toEqual(mockResponse.works);
  });

  it('getBookByKey obtiene un libro por clave', async () => {
    const mockBook = {
      key: '/works/123',
      title: 'Test Book',
      description: 'A test book'
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBook
    });

    const result = await bookRepository.getBookByKey('123');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/works/123.json')
    );
    expect(result).toEqual(mockBook);
  });

  it('getCoverUrl genera URL correcta para portadas', () => {
    const coverId = 12345;
    const url = bookRepository.getCoverUrl(coverId, 'L');

    expect(url).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg');
  });

  it('getCoverUrl retorna null si no hay coverId', () => {
    const url = bookRepository.getCoverUrl(null);

    expect(url).toBeNull();
  });

  it('maneja errores de fetch', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(bookRepository.searchBooks('test')).rejects.toThrow();
  });

  it('getRecentBooks obtiene libros recientes', async () => {
    const mockResponse = {
      docs: [{ key: '/works/789', title: 'Recent Book' }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.getRecentBooks(1);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/search.json');
    expect(callUrl).toContain('sort=new');
    expect(result).toEqual(mockResponse.docs);
  });

  it('getClassicBooks obtiene libros clásicos', async () => {
    const mockResponse = {
      works: [{ key: '/works/classic1', title: 'Classic Book' }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.getClassicBooks(1);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/subjects/classics.json');
    expect(result).toEqual(mockResponse.works);
  });

  it('getBestsellerBooks obtiene bestsellers', async () => {
    const mockResponse = {
      works: [{ key: '/works/best1', title: 'Bestseller Book' }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.getBestsellerBooks(1);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/subjects/bestsellers.json');
    expect(result).toEqual(mockResponse.works);
  });

  it('getBooksBySubject obtiene libros por tema', async () => {
    const mockResponse = {
      works: [{ key: '/works/sci1', title: 'Sci-Fi Book' }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await bookRepository.getBooksBySubject('science fiction', 1);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/subjects/science_fiction.json');
    expect(result).toEqual(mockResponse.works);
  });

  it('getBooksBySubject normaliza espacios y mayúsculas', async () => {
    const mockResponse = { works: [] };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await bookRepository.getBooksBySubject('  Fantasy BOOKS  ', 1);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('fantasy_books');
  });

  it('getBooksBySubject calcula offset para paginación', async () => {
    const mockResponse = { works: [] };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await bookRepository.getBooksBySubject('romance', 3);

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('offset=40');
  });

  it('getBookByKey extrae ID de la clave completa', async () => {
    const mockBook = { key: '/works/123', title: 'Test' };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBook
    });

    await bookRepository.getBookByKey('/works/123');

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/works/123.json');
  });

  it('getBookByKey obtiene autores si existen', async () => {
    const mockBook = {
      key: '/works/123',
      title: 'Test',
      authors: [
        { author: { key: '/authors/OL1A' } }
      ]
    };

    const mockAuthor = { name: 'Test Author' };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBook
    });

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthor
    });

    const result = await bookRepository.getBookByKey('123');

    expect(result.author_name).toEqual(['Test Author']);
  });

  it('getBookByKey maneja error al obtener autor', async () => {
    const mockBook = {
      key: '/works/123',
      title: 'Test',
      authors: [
        { author: { key: '/authors/OL1A' } }
      ]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBook
    });

    globalThis.fetch.mockRejectedValueOnce(new Error('Author fetch error'));

    const result = await bookRepository.getBookByKey('123');

    expect(result.author_name).toEqual([]);
  });

  it('getAuthorByKey obtiene autor por clave', async () => {
    const mockAuthor = { name: 'J.K. Rowling', birth_date: '1965' };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthor
    });

    const result = await bookRepository.getAuthorByKey('OL1A');

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/authors/OL1A.json');
    expect(result).toEqual(mockAuthor);
  });

  it('getAuthorByKey extrae ID de clave completa', async () => {
    const mockAuthor = { name: 'Test Author' };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthor
    });

    await bookRepository.getAuthorByKey('/authors/OL1A');

    const callUrl = globalThis.fetch.mock.calls[0][0];
    expect(callUrl).toContain('/authors/OL1A.json');
  });

  it('getCoverUrl usa tamaño medium si se especifica', () => {
    const url = bookRepository.getCoverUrl(12345, 'M');
    expect(url).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
  });

  it('getJson omite parámetros vacíos, null o undefined', async () => {
    const mockResponse = { docs: [] };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await bookRepository.searchBooks('', 1);

    const callUrl = globalThis.fetch.mock.calls[0][0];

    expect(callUrl).not.toContain('q=');
    expect(callUrl).toContain('page=1');
  });
});
