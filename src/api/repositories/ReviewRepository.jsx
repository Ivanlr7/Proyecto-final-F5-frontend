import axios from 'axios';

class ReviewRepository {
  constructor() {
    this.baseURL = `${import.meta.env.VITE_API_BASE_URL}/reviews`;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }


  async createReview(reviewRequest, token) {
    try {
      const response = await this.client.post('', reviewRequest, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getAllReviews() {
    try {
      const response = await this.client.get('');
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener reseñas';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getReviewById(id) {
    try {
      const response = await this.client.get(`/${id}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getReviewsByUser(userId) {
    try {
      const response = await this.client.get(`/user/${userId}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener reseñas del usuario';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getReviewsByContent(contentType, contentId) {
    try {
      const response = await this.client.get(`/content`, {
        params: { contentType, contentId }
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener reseñas del contenido';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getContentStats(contentType, contentId) {
    try {
      const response = await this.client.get(`/content/stats`, {
        params: { contentType, contentId }
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async updateReview(id, reviewRequest, token) {
    try {
      const response = await this.client.put(`/${id}`, reviewRequest, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al actualizar la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async deleteReview(id, token) {
    try {
      const response = await this.client.delete(`/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al eliminar la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

    async likeReview(id, token) {
    try {
      const response = await this.client.post(`/${id}/like`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al dar like a la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async unlikeReview(id, token) {
    try {
      const response = await this.client.delete(`/${id}/like`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al quitar like a la reseña';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

}

export default ReviewRepository;
