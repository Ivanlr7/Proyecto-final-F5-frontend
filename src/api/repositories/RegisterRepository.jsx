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


    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async register(userData, profileImage) {

    const registerData = {
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      profileImagePath: profileImage?.name || "",
    };


    const formDataBody = new FormData();

    const dataBlob = new Blob([JSON.stringify(registerData)], { 
      type: "application/json" 
    });
    formDataBody.append("data", dataBlob);


    if (profileImage) {
      formDataBody.append("profileImage", profileImage, profileImage.name);
    }

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