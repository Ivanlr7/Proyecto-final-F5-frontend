import ReviewRepository from '../repositories/ReviewRepository';

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  //Token gestionado con redux para comprobar la autenticación
  async createReview(reviewRequest, token) {
   
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.reviewRepository.createReview(reviewRequest, token);
  }

  async getAllReviews() {
    return await this.reviewRepository.getAllReviews();
  }

  async getReviewById(id) {
    return await this.reviewRepository.getReviewById(id);
  }

  async getReviewsByUser(userId) {
    return await this.reviewRepository.getReviewsByUser(userId);
  }

  async getReviewsByContent(contentType, contentId) {
    return await this.reviewRepository.getReviewsByContent(contentType, contentId);
  }

  async getContentStats(contentType, contentId) {
    return await this.reviewRepository.getContentStats(contentType, contentId);
  }

  async updateReview(id, reviewRequest, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.reviewRepository.updateReview(id, reviewRequest, token);
  }

  async deleteReview(id, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.reviewRepository.deleteReview(id, token);
  }

    async likeReview(id, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.reviewRepository.likeReview(id, token);
  }

  async unlikeReview(id, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.reviewRepository.unlikeReview(id, token);
  }
}

export default ReviewService;
