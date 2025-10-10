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