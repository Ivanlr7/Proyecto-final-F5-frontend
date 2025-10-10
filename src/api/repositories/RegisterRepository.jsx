import axios from 'axios';

class RegisterRepository {
  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async register(userData, profileImage) {
    // Crear el DTO de datos
    const registerData = {
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      profileImagePath: profileImage?.name || "",
    };

    // Crear FormData para multipart/form-data
    const formDataBody = new FormData();
    
    // Añadir datos como JSON blob
    const dataBlob = new Blob([JSON.stringify(registerData)], { 
      type: "application/json" 
    });
    formDataBody.append("data", dataBlob);

    // Añadir imagen si existe
    if (profileImage) {
      formDataBody.append("profileImage", profileImage, profileImage.name);
    }

    // Realizar petición POST
    const response = await this.apiClient.post("/register", formDataBody, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }
}

export default RegisterRepository;