import RegisterRepository from "../repositories/RegisterRepository";

class RegisterService {
  constructor() {
    this.registerRepository = new RegisterRepository();
  }

  async registerUser(formData) {
    try {
     
      const userDataForValidation = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        profileImage: formData.profileImage
      };

   
      this.validateUserData(userDataForValidation);


      const userDataForAPI = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,

      };

      const result = await this.registerRepository.register(
        userDataForAPI, 
        formData.profileImage
      );

      return result;
    } catch (error) {
      console.error('Error en el servicio de registro:', error);
      
     
      if (error.response) {
       
        const message = error.response.data?.message || 'Error al registrar usuario';
        throw new Error(message);
      } else if (error.request) {
  
        throw new Error('Error de conexión con el servidor');
      } else {
     
        throw error;
      }
    }
  }

  validateUserData(userData) {
    const errors = [];


    if (!userData.userName || userData.userName.trim().length < 3) {
      errors.push('El nombre de usuario debe tener al menos 3 caracteres');
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push('El email no es válido');
    }

    if (!userData.password || userData.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }


    if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }


    if (userData.profileImage) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validImageTypes.includes(userData.profileImage.type)) {
        errors.push('La imagen debe ser JPG, PNG o WebP');
      }
      

      const maxSize = 5 * 1024 * 1024;
      if (userData.profileImage.size > maxSize) {
        errors.push('La imagen no puede superar los 5MB');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

const registerService = new RegisterService();

export default registerService;