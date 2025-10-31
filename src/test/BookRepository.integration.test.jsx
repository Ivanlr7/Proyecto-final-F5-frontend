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
});
