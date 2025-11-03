import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewService from '../../src/api/services/ReviewService';

const reviewService = new ReviewService();

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ReviewService integration', () => {
  it('createReview retorna error si no hay token', async () => {
    const result = await reviewService.createReview({ content: 'test' });
    expect(result).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  it('createReview llama al repository con token válido', async () => {
    const mockReview = { id: 1, content: 'test' };
    reviewService.reviewRepository.createReview = vi.fn().mockResolvedValueOnce({ success: true, data: mockReview });
    const result = await reviewService.createReview({ content: 'test' }, 'fake-token');
    expect(reviewService.reviewRepository.createReview).toHaveBeenCalledWith({ content: 'test' }, 'fake-token');
    expect(result).toEqual({ success: true, data: mockReview });
  });

  it('getAllReviews llama al repository', async () => {
    const mockReviews = [{ id: 1 }, { id: 2 }];
    reviewService.reviewRepository.getAllReviews = vi.fn().mockResolvedValueOnce({ success: true, data: mockReviews });
    const result = await reviewService.getAllReviews();
    expect(reviewService.reviewRepository.getAllReviews).toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: mockReviews });
  });

  it('getReviewById llama al repository con id correcto', async () => {
    const mockReview = { id: 1, content: 'test' };
    reviewService.reviewRepository.getReviewById = vi.fn().mockResolvedValueOnce({ success: true, data: mockReview });
    const result = await reviewService.getReviewById(1);
    expect(reviewService.reviewRepository.getReviewById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, data: mockReview });
  });

  it('updateReview retorna error si no hay token', async () => {
    const result = await reviewService.updateReview(1, { content: 'updated' });
    expect(result).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  it('deleteReview retorna error si no hay token', async () => {
    const result = await reviewService.deleteReview(1);
    expect(result).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  it('likeReview retorna error si no hay token', async () => {
    const result = await reviewService.likeReview(1);
    expect(result).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  it('unlikeReview retorna error si no hay token', async () => {
    const result = await reviewService.unlikeReview(1);
    expect(result).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  it('getReviewsByUser llama al repository con userId correcto', async () => {
    const mockReviews = [{ id: 1, userId: 5 }];
    reviewService.reviewRepository.getReviewsByUser = vi.fn().mockResolvedValueOnce({ success: true, data: mockReviews });
    const result = await reviewService.getReviewsByUser(5);
    expect(reviewService.reviewRepository.getReviewsByUser).toHaveBeenCalledWith(5);
    expect(result.success).toBe(true);
  });

  it('getReviewsByContent llama al repository con parámetros correctos', async () => {
    const mockReviews = [{ id: 1, contentType: 'MOVIE', contentId: '123' }];
    reviewService.reviewRepository.getReviewsByContent = vi.fn().mockResolvedValueOnce({ success: true, data: mockReviews });
    const result = await reviewService.getReviewsByContent('MOVIE', '123');
    expect(reviewService.reviewRepository.getReviewsByContent).toHaveBeenCalledWith('MOVIE', '123');
    expect(result.success).toBe(true);
  });

  it('getContentStats llama al repository con parámetros correctos', async () => {
    const mockStats = { averageRating: 4.5, totalReviews: 10 };
    reviewService.reviewRepository.getContentStats = vi.fn().mockResolvedValueOnce({ success: true, data: mockStats });
    const result = await reviewService.getContentStats('MOVIE', '123');
    expect(reviewService.reviewRepository.getContentStats).toHaveBeenCalledWith('MOVIE', '123');
    expect(result.success).toBe(true);
  });

  it('updateReview llama al repository con token válido', async () => {
    const mockUpdated = { id: 1, content: 'updated' };
    reviewService.reviewRepository.updateReview = vi.fn().mockResolvedValueOnce({ success: true, data: mockUpdated });
    const result = await reviewService.updateReview(1, { content: 'updated' }, 'fake-token');
    expect(reviewService.reviewRepository.updateReview).toHaveBeenCalledWith(1, { content: 'updated' }, 'fake-token');
    expect(result.success).toBe(true);
  });

  it('deleteReview llama al repository con token válido', async () => {
    reviewService.reviewRepository.deleteReview = vi.fn().mockResolvedValueOnce({ success: true });
    const result = await reviewService.deleteReview(1, 'fake-token');
    expect(reviewService.reviewRepository.deleteReview).toHaveBeenCalledWith(1, 'fake-token');
    expect(result.success).toBe(true);
  });

  it('likeReview llama al repository con token válido', async () => {
    reviewService.reviewRepository.likeReview = vi.fn().mockResolvedValueOnce({ success: true });
    const result = await reviewService.likeReview(1, 'fake-token');
    expect(reviewService.reviewRepository.likeReview).toHaveBeenCalledWith(1, 'fake-token');
    expect(result.success).toBe(true);
  });

  it('unlikeReview llama al repository con token válido', async () => {
    reviewService.reviewRepository.unlikeReview = vi.fn().mockResolvedValueOnce({ success: true });
    const result = await reviewService.unlikeReview(1, 'fake-token');
    expect(reviewService.reviewRepository.unlikeReview).toHaveBeenCalledWith(1, 'fake-token');
    expect(result.success).toBe(true);
  });
});
