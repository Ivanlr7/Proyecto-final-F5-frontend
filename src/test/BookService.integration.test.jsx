import { describe, it, expect, vi, beforeEach } from 'vitest';
import bookService from '../../src/api/services/BookService';
import BookRepository from '../../src/api/repositories/BookRepository';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('BookService integration', () => {
  it('searchBooks llama al repository con query correcto', async () => {
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

  it('getBookById llama al repository con id correcto', async () => {
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

  it('formatBook formatea correctamente un libro', () => {
    const raw = {
      key: '/works/123',
      title: 'Test Book',
      cover_i: 12345,
      author_name: ['Author 1'],
      first_publish_year: 2020
    };
    const formatted = bookService.formatBook(raw);
    expect(formatted).toEqual(expect.objectContaining({
      id: '123',
      title: 'Test Book',
      author_name: ['Author 1']
    }));
  });
});
