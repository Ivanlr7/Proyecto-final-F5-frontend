import { describe, it, expect, vi, beforeEach } from 'vitest';
import bookService from '../../src/api/services/BookService';
import BookRepository from '../../src/api/repositories/BookRepository';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('BookService integration', () => {
  describe('searchBooks', () => {
    it('llama al repository con query correcto', async () => {
      const mockBooks = [{ id: 1, title: 'Test Book' }];
      const spy = vi.spyOn(BookRepository, 'searchBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.searchBooks('test');
      expect(spy).toHaveBeenCalledWith('test', 1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toMatchObject([
        expect.objectContaining({
          id: expect.anything(),
          title: 'Test Book',
          vote_average: expect.any(Number)
        })
      ]);
      spy.mockRestore();
    });

    it('llama al repository con página especificada', async () => {
      const spy = vi.spyOn(BookRepository, 'searchBooks').mockResolvedValueOnce([]);
      await bookService.searchBooks('test', 2);
      expect(spy).toHaveBeenCalledWith('test', 2);
      spy.mockRestore();
    });

    it('filtra resultados null', async () => {
      const spy = vi.spyOn(BookRepository, 'searchBooks').mockResolvedValueOnce([null, { title: 'Book' }]);
      const result = await bookService.searchBooks('test');
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('getPopularBooks', () => {
    it('llama al repository y mapea resultados', async () => {
      const mockBooks = [{ title: 'Popular Book' }];
      const spy = vi.spyOn(BookRepository, 'getPopularBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getPopularBooks();
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });

    it('llama al repository con página especificada', async () => {
      const spy = vi.spyOn(BookRepository, 'getPopularBooks').mockResolvedValueOnce([]);
      await bookService.getPopularBooks(3);
      expect(spy).toHaveBeenCalledWith(3);
      spy.mockRestore();
    });
  });

  describe('getRecentBooks', () => {
    it('llama al repository y mapea resultados', async () => {
      const mockBooks = [{ title: 'Recent Book' }];
      const spy = vi.spyOn(BookRepository, 'getRecentBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getRecentBooks();
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('getClassicBooks', () => {
    it('llama al repository y mapea resultados', async () => {
      const mockBooks = [{ title: 'Classic Book' }];
      const spy = vi.spyOn(BookRepository, 'getClassicBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getClassicBooks();
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('getBestsellerBooks', () => {
    it('llama al repository y mapea resultados', async () => {
      const mockBooks = [{ title: 'Bestseller Book' }];
      const spy = vi.spyOn(BookRepository, 'getBestsellerBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getBestsellerBooks();
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('getBooksBySubject', () => {
    it('llama al repository con el subject correcto', async () => {
      const mockBooks = [{ title: 'Subject Book' }];
      const spy = vi.spyOn(BookRepository, 'getBooksBySubject').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getBooksBySubject('fiction');
      expect(spy).toHaveBeenCalledWith('fiction', 1);
      expect(result).toHaveLength(1);
      spy.mockRestore();
    });
  });

  describe('getBookById', () => {
    it('llama al repository con id correcto', async () => {
      const mockBook = { id: 1, title: 'Test Book' };
      const spy = vi.spyOn(BookRepository, 'getBookByKey').mockResolvedValueOnce(mockBook);
      const result = await bookService.getBookById('1');
      expect(spy).toHaveBeenCalledWith('1');
      expect(result).toMatchObject(
        expect.objectContaining({
          id: expect.anything(),
          title: 'Test Book',
          vote_average: expect.any(Number)
        })
      );
      spy.mockRestore();
    });

    it('retorna null si el repository no encuentra el libro', async () => {
      const spy = vi.spyOn(BookRepository, 'getBookByKey').mockResolvedValueOnce(null);
      const result = await bookService.getBookById('999');
      expect(result).toBeNull();
      spy.mockRestore();
    });
  });

  describe('getSimilarBooks', () => {
    it('retorna libros similares por subject', async () => {
      const book = { id: '1', subjects: ['fiction', 'adventure'] };
      const mockBooks = [
        { key: '/works/1', title: 'Original' },
        { key: '/works/2', title: 'Similar 1' },
        { key: '/works/3', title: 'Similar 2' }
      ];
      const spy = vi.spyOn(BookRepository, 'getBooksBySubject').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getSimilarBooks(book);
      expect(spy).toHaveBeenCalledWith('fiction', 1);
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.every(b => b.id !== '1')).toBe(true);
      spy.mockRestore();
    });

    it('retorna libros similares por título si no hay subject', async () => {
      const book = { id: '1', title: 'Harry Potter: The Beginning' };
      const mockBooks = [
        { key: '/works/1', title: 'Harry Potter: The Beginning' },
        { key: '/works/2', title: 'Harry Potter 2' }
      ];
      const spy = vi.spyOn(BookRepository, 'searchBooks').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getSimilarBooks(book);
      expect(spy).toHaveBeenCalledWith('Harry Potter', 1);
      expect(result.every(b => b.id !== '1')).toBe(true);
      spy.mockRestore();
    });

    it('retorna array vacío si no hay subject ni title', async () => {
      const book = { id: '1' };
      const result = await bookService.getSimilarBooks(book);
      expect(result).toEqual([]);
    });

    it('limita resultados a 10 libros', async () => {
      const book = { id: '1', subjects: ['fiction'] };
      const mockBooks = Array.from({ length: 20 }, (_, i) => ({ key: `/works/${i}`, title: `Book ${i}` }));
      const spy = vi.spyOn(BookRepository, 'getBooksBySubject').mockResolvedValueOnce(mockBooks);
      const result = await bookService.getSimilarBooks(book);
      expect(result.length).toBeLessThanOrEqual(10);
      spy.mockRestore();
    });
  });

  describe('formatBook', () => {
    it('formatea correctamente un libro completo', () => {
      const raw = {
        key: '/works/123',
        title: 'Test Book',
        cover_i: 12345,
        author_name: ['Author 1'],
        first_publish_year: 2020,
        subject: ['fiction', 'adventure'],
        publisher: 'Publisher Name',
        language: 'en',
        description: 'A great book',
        ratings_average: 4.5,
        edition_count: 10,
        number_of_pages_median: 350,
        isbn: ['1234567890']
      };
      const formatted = bookService.formatBook(raw);
      expect(formatted).toEqual(expect.objectContaining({
        id: '123',
        title: 'Test Book',
        author_name: ['Author 1'],
        release_year: 2020,
        subjects: ['fiction', 'adventure'],
        vote_average: 4.5,
        edition_count: 10
      }));
    });

    it('extrae id de cover_edition_key', () => {
      const formatted = bookService.formatBook({ cover_edition_key: '/books/456' });
      expect(formatted.id).toBe('456');
    });

    it('extrae id de edition_key array', () => {
      const formatted = bookService.formatBook({ edition_key: ['/books/789'] });
      expect(formatted.id).toBe('789');
    });

    it('usa cover_id si cover_i no está disponible', () => {
      const spy = vi.spyOn(BookRepository, 'getCoverUrl').mockReturnValue('url');
      bookService.formatBook({ cover_id: 999 });
      expect(spy).toHaveBeenCalledWith(999, 'L');
      spy.mockRestore();
    });

    it('usa covers array si cover_i no está disponible', () => {
      const spy = vi.spyOn(BookRepository, 'getCoverUrl').mockReturnValue('url');
      bookService.formatBook({ covers: [888] });
      expect(spy).toHaveBeenCalledWith(888, 'L');
      spy.mockRestore();
    });

    it('retorna null para cover_url si no hay coverId', () => {
      const formatted = bookService.formatBook({ title: 'No Cover Book' });
      expect(formatted.cover_url).toBeNull();
      expect(formatted.poster_url).toBeNull();
      expect(formatted.backdrop_url).toBeNull();
    });

    it('extrae autores de authors.name', () => {
      const formatted = bookService.formatBook({
        authors: [{ name: 'Author 1' }, { name: 'Author 2' }]
      });
      expect(formatted.author_name).toEqual(['Author 1', 'Author 2']);
    });

    it('filtra autores null en authors array', () => {
      const formatted = bookService.formatBook({
        authors: [{ name: 'Author 1' }, { name: null }, { name: 'Author 2' }]
      });
      expect(formatted.author_name).toEqual(['Author 1', 'Author 2']);
    });

    it('procesa subjects como strings', () => {
      const formatted = bookService.formatBook({
        subjects: ['fiction', 'mystery']
      });
      expect(formatted.subjects).toEqual(['fiction', 'mystery']);
    });

    it('procesa subjects como objetos con key', () => {
      const formatted = bookService.formatBook({
        subjects: [
          { key: '/subjects/fiction' },
          { key: '/subjects/mystery' }
        ]
      });
      expect(formatted.subjects).toEqual(['fiction', 'mystery']);
    });

    it('extrae first_publish_year de first_publish_date', () => {
      const formatted = bookService.formatBook({ first_publish_date: '2020' });
      expect(formatted.release_year).toBe(2020);
    });

    it('extrae first_publish_year de created.value', () => {
      const formatted = bookService.formatBook({ created: { value: '2019-05-15' } });
      expect(formatted.release_year).toBe(2019);
    });

    it('usa description.value si está disponible', () => {
      const formatted = bookService.formatBook({
        description: { value: 'Detailed description' }
      });
      expect(formatted.overview).toBe('Detailed description');
    });

    it('usa subtitle si no hay description', () => {
      const formatted = bookService.formatBook({
        subtitle: 'A subtitle'
      });
      expect(formatted.overview).toBe('A subtitle');
    });

    it('genera vote_average aleatorio si no hay rating', () => {
      const formatted = bookService.formatBook({ title: 'Book' });
      expect(formatted.vote_average).toBeGreaterThanOrEqual(6);
      expect(formatted.vote_average).toBeLessThanOrEqual(10);
    });

    it('usa rating del raw si ratings_average no está disponible', () => {
      const formatted = bookService.formatBook({ rating: 7.5 });
      expect(formatted.vote_average).toBe(7.5);
    });

    it('procesa person array de strings', () => {
      const formatted = bookService.formatBook({
        person: ['Person 1', 'Person 2']
      });
      expect(formatted.person).toEqual(['Person 1', 'Person 2']);
    });

    it('procesa person array de objetos con key', () => {
      const formatted = bookService.formatBook({
        person: [{ key: '/subjects/person1' }, { key: '/subjects/person2' }]
      });
      expect(formatted.person).toEqual(['person1', 'person2']);
    });

    it('procesa place array de strings', () => {
      const formatted = bookService.formatBook({
        place: ['Place 1', 'Place 2']
      });
      expect(formatted.place).toEqual(['Place 1', 'Place 2']);
    });

    it('procesa place array de objetos con key', () => {
      const formatted = bookService.formatBook({
        place: [{ key: '/subjects/place1' }, { key: '/subjects/place2' }]
      });
      expect(formatted.place).toEqual(['place1', 'place2']);
    });

    it('procesa isbn como array', () => {
      const formatted = bookService.formatBook({
        isbn: ['123', '456']
      });
      expect(formatted.isbn).toEqual(['123', '456']);
    });

    it('convierte isbn string a array', () => {
      const formatted = bookService.formatBook({
        isbn: '1234567890'
      });
      expect(formatted.isbn).toEqual(['1234567890']);
    });

    it('usa isbn13 si isbn no está disponible', () => {
      const formatted = bookService.formatBook({
        isbn13: ['9781234567890']
      });
      expect(formatted.isbn).toEqual(['9781234567890']);
    });

    it('usa isbn10 si isbn e isbn13 no están disponibles', () => {
      const formatted = bookService.formatBook({
        isbn10: ['1234567890']
      });
      expect(formatted.isbn).toEqual(['1234567890']);
    });

    it('retorna null si raw es null', () => {
      const formatted = bookService.formatBook(null);
      expect(formatted).toBeNull();
    });

    it('retorna null si raw es undefined', () => {
      const formatted = bookService.formatBook(undefined);
      expect(formatted).toBeNull();
    });

    it('incluye el objeto raw original', () => {
      const raw = { title: 'Book', extra: 'data' };
      const formatted = bookService.formatBook(raw);
      expect(formatted.raw).toEqual(raw);
    });

    it('asigna arrays vacíos para campos opcionales faltantes', () => {
      const formatted = bookService.formatBook({ title: 'Minimal Book' });
      expect(formatted.author_name).toEqual([]);
      expect(formatted.subjects).toEqual([]);
      expect(formatted.person).toEqual([]);
      expect(formatted.place).toEqual([]);
    });
  });
});
