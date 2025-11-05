import axios from 'axios';

class UserRepository {
  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000
     
    });


    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('User API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

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


  async updateUser(id, userData, token) {

    const formData = new FormData();
    const userPayload = {
      userName: userData.userName,
      email: userData.email
    };
    
   
    const jsonBlob = new Blob([JSON.stringify(userPayload)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    if (userData && userData.profileImage && userData.profileImage instanceof File) {
      formData.append('profileImage', userData.profileImage);
    }

    const response = await this.apiClient.put(`/users/${id}`, formData, {
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
