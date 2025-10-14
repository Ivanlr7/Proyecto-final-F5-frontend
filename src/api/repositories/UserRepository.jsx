import axios from 'axios';

class UserRepository {
  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para errores
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('User API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Obtener el usuario actual autenticado
  async getCurrentUser(token) {
    const response = await this.apiClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  // Obtener usuario por ID
  async getUserById(id, token) {
    const response = await this.apiClient.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  // Obtener todos los usuarios (solo admin)
  async getAllUsers(token) {
    const response = await this.apiClient.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  // Actualizar usuario
  async updateUser(id, userData, token) {
    const response = await this.apiClient.put(`/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  // Eliminar usuario
  async deleteUser(id, token) {
    const response = await this.apiClient.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }
}

export default UserRepository;
