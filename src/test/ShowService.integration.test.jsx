import { describe, it, expect, vi, beforeEach } from 'vitest';
import showService from '../../src/api/services/ShowService';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ShowService integration', () => {
  it('getPopularShows llama al repository y procesa resultados', async () => {
    const mockShows = { results: [{ id: 1, name: 'Test Show' }], page: 1 };
    showService.showRepository.getPopularShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
    const result = await showService.getPopularShows(1);
    expect(showService.showRepository.getPopularShows).toHaveBeenCalledWith(1);
    expect(result.success).toBe(true);
    expect(result.data.results).toBeDefined();
  });

  it('getPopularShows lanza error si la página es inválida', async () => {
    const result = await showService.getPopularShows(1001);
    expect(result.success).toBe(false);
  });

  it('getShowDetails llama al repository con id correcto', async () => {
    const mockShow = { id: 1, name: 'Test Show' };
    showService.showRepository.getShowDetails = vi.fn().mockResolvedValueOnce({ success: true, data: mockShow });
    const result = await showService.getShowDetails(1);
    expect(showService.showRepository.getShowDetails).toHaveBeenCalledWith(1);
    expect(result.success).toBe(true);
  });

  it('searchShows llama al repository con query correcto', async () => {
    const mockShows = { results: [{ id: 1, name: 'Test Show' }] };
    showService.showRepository.searchShows = vi.fn().mockResolvedValueOnce({ success: true, data: mockShows });
    const result = await showService.searchShows('test', 1);
    expect(showService.showRepository.searchShows).toHaveBeenCalledWith('test', 1);
    expect(result.success).toBe(true);
  });
});
