import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewRepository from '../../src/api/repositories/ReviewRepository';
import axios from 'axios';

vi.mock('axios');

describe('ReviewRepository integration', () => {
  let reviewRepository;
  let mockAxiosInstance;
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    axios.create.mockReturnValue(mockAxiosInstance);
    reviewRepository = new ReviewRepository();
  });

  it('createReview crea una nueva review con token', async () => {
    const reviewRequest = {
      contentId: '123',
      contentType: 'MOVIE',
      rating: 5,
      comment: 'Great movie!'
    };

    const mockResponse = {
      status: 201,
      data: { id: 1, ...reviewRequest }
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.createReview(reviewRequest, mockToken);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('', reviewRequest, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expect(result).toEqual({
      success: true,
      data: mockResponse.data,
      status: 201
    });
  });

  it('getAllReviews obtiene todas las reviews', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Great!' },
      { id: 2, rating: 4, comment: 'Good' }
    ];

    const mockResponse = {
      status: 200,
      data: mockReviews
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.getAllReviews();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('');
    expect(result).toEqual({
      success: true,
      data: mockReviews,
      status: 200
    });
  });

  it('getReviewById obtiene una review por ID', async () => {
    const reviewId = 1;
    const mockReview = { id: reviewId, rating: 5, comment: 'Great!' };

    const mockResponse = {
      status: 200,
      data: mockReview
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.getReviewById(reviewId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/${reviewId}`);
    expect(result).toEqual({
      success: true,
      data: mockReview,
      status: 200
    });
  });

  it('getReviewsByUser obtiene las reviews de un usuario', async () => {
    const userId = 1;
    const mockReviews = [
      { id: 1, userId, rating: 5 },
      { id: 2, userId, rating: 4 }
    ];

    const mockResponse = {
      status: 200,
      data: mockReviews
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.getReviewsByUser(userId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/user/${userId}`);
    expect(result).toEqual({
      success: true,
      data: mockReviews,
      status: 200
    });
  });

  it('getReviewsByContent obtiene las reviews de un contenido', async () => {
    const contentType = 'MOVIE';
    const contentId = '123';
    const mockReviews = [
      { id: 1, contentType, contentId, rating: 5 }
    ];

    const mockResponse = {
      status: 200,
      data: mockReviews
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.getReviewsByContent(contentType, contentId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/content', {
      params: { contentType, contentId }
    });
    expect(result).toEqual({
      success: true,
      data: mockReviews,
      status: 200
    });
  });

  it('getContentStats obtiene estadísticas de un contenido', async () => {
    const contentType = 'MOVIE';
    const contentId = '123';
    const mockStats = {
      averageRating: 4.5,
      totalReviews: 10
    };

    const mockResponse = {
      status: 200,
      data: mockStats
    };

    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.getContentStats(contentType, contentId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/content/stats', {
      params: { contentType, contentId }
    });
    expect(result).toEqual({
      success: true,
      data: mockStats,
      status: 200
    });
  });

  it('updateReview actualiza una review', async () => {
    const reviewId = 1;
    const reviewRequest = {
      rating: 4,
      comment: 'Updated comment'
    };

    const mockResponse = {
      status: 200,
      data: { id: reviewId, ...reviewRequest }
    };

    mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.updateReview(reviewId, reviewRequest, mockToken);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/${reviewId}`, reviewRequest, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expect(result).toEqual({
      success: true,
      data: mockResponse.data,
      status: 200
    });
  });

  it('deleteReview elimina una review', async () => {
    const reviewId = 1;
    const mockResponse = {
      status: 204
    };

    mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.deleteReview(reviewId, mockToken);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/${reviewId}`, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expect(result).toEqual({
      success: true,
      status: 204
    });
  });

  it('likeReview da like a una review', async () => {
    const reviewId = 1;
    const mockResponse = {
      status: 200
    };

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.likeReview(reviewId, mockToken);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/${reviewId}/like`, {}, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expect(result).toEqual({
      success: true,
      status: 200
    });
  });

  it('unlikeReview quita el like a una review', async () => {
    const reviewId = 1;
    const mockResponse = {
      status: 200
    };

    mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

    const result = await reviewRepository.unlikeReview(reviewId, mockToken);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/${reviewId}/like`, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expect(result).toEqual({
      success: true,
      status: 200
    });
  });

  it('maneja errores al crear una review', async () => {
    const reviewRequest = {
      contentId: '123',
      contentType: 'MOVIE',
      rating: 5,
      comment: 'Great!'
    };

    const mockError = {
      response: {
        status: 400,
        data: { message: 'Invalid data' }
      }
    };

    mockAxiosInstance.post.mockRejectedValueOnce(mockError);

    const result = await reviewRepository.createReview(reviewRequest, mockToken);

    expect(result).toEqual({
      success: false,
      error: 'Invalid data',
      status: 400
    });
  });
});
