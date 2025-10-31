import axios from 'axios';

class ListRepository {
  constructor() {
    this.baseURL = `${import.meta.env.VITE_API_BASE_URL}/lists`;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createList(listRequest, token) {
    try {
      const response = await this.client.post('', listRequest, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear la lista';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getAllLists() {
    try {
      const response = await this.client.get('');
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener listas';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getListById(id) {
    try {
      const response = await this.client.get(`/${id}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener la lista';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async getListsByUser(userId) {
    try {
      const response = await this.client.get(`/user/${userId}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al obtener listas del usuario';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async updateList(id, listRequest, token) {
    try {
      const response = await this.client.put(`/${id}`, listRequest, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al actualizar la lista';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }

  async deleteList(id, token) {
    try {
      const response = await this.client.delete(`/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { success: true, status: response.status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al eliminar la lista';
      return { success: false, error: errorMessage, status: error.response?.status || 500 };
    }
  }
}

export default ListRepository;
