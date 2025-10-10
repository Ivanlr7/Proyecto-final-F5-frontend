import axios from 'axios';

class AuthRepository {
  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Auth API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async login(loginData) {
    
    const loginRequest = {
      identifier: loginData.identifier, 
      password: loginData.password
    };


    const response = await this.apiClient.post("/auth/login", loginRequest);

    return {
      success: true,
      status: response.status,
      data: response.data, 
    };
  }

  async refreshToken(refreshToken) {
    const response = await this.apiClient.post("/auth/refresh", {
      refreshToken: refreshToken
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  /**
   * Logout (invalidar token en servidor si tu backend lo soporta)
   * @param {string} token - Token a invalidar
   * @returns {Promise<Object>} - Respuesta de logout
   */
  async logout(token) {
    const response = await this.apiClient.post("/auth/logout", {}, {
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

export default AuthRepository;