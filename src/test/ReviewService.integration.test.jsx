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
});
