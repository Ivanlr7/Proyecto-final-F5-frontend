import UserRepository from "../repositories/UserRepository";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.baseImageUrl = 'http://localhost:8080/api/v1/files/images';
  }


  getImageUrl(profileImage) {
    if (!profileImage) return null;

    if (profileImage.startsWith('data:image') || profileImage.startsWith('http')) {
      return profileImage;
    }
  
    return `${this.baseImageUrl}/${profileImage}`;
  }


  async getCurrentUser(token) {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const result = await this.userRepository.getCurrentUser(token);
      
      if (result.success && result.data) {

        const userData = {
          ...result.data,
          profileImage: this.getImageUrl(result.data.profileImage)
        };
        
        return {
          success: true,
          message: 'Usuario obtenido exitosamente',
          data: userData
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('Error en UserService.getCurrentUser:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;
        
        if (status === 401) {
          throw new Error('No autorizado para acceder a este usuario');
        } else if (status === 403) {
          throw new Error('Acceso denegado');
        } else if (status === 404) {
          throw new Error('Usuario no encontrado');
        } else if (status >= 500) {
          throw new Error('Error interno del servidor');
        } else {
          throw new Error(typeof message === 'string' ? message : 'Error al obtener usuario');
        }
      } else if (error.request) {
        throw new Error('Error de conexión con el servidor');
      } else {
        throw error;
      }
    }
  }


  async getUserById(id, token) {
    try {
      this.validateUserId(id);
      
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const result = await this.userRepository.getUserById(id, token);
      
      if (result.success && result.data) {
        return {
          success: true,
          message: 'Usuario obtenido exitosamente',
          data: result.data
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('Error en UserService.getUserById:', error);
      this.handleUserServiceError(error);
    }
  }


  async updateUser(id, userData, token) {
    try {
      this.validateUserId(id);
      this.validateUserData(userData);
      
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      let dataToSend = { ...userData };
      if (!(userData.profileImage instanceof File)) {
    
        delete dataToSend.profileImage;
      }

      const result = await this.userRepository.updateUser(id, dataToSend, token);
      
      if (result.success && result.data) {

        const updatedUserData = {
          ...result.data,
          profileImage: this.getImageUrl(result.data.profileImage)
        };
        
        return {
          success: true,
          message: 'Usuario actualizado exitosamente',
          data: updatedUserData
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('Error en UserService.updateUser:', error);
      this.handleUserServiceError(error);
    }
  }


  async getAllUsers(token) {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const result = await this.userRepository.getAllUsers(token);
      
      if (result.success && result.data) {
        return {
          success: true,
          message: 'Usuarios obtenidos exitosamente',
          data: result.data
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('Error en UserService.getAllUsers:', error);
      this.handleUserServiceError(error);
    }
  }


  async deleteUser(id, token) {
    try {
      this.validateUserId(id);
      
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      await this.userRepository.deleteUser(id, token);
      
      return {
        success: true,
        message: 'Usuario eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error en UserService.deleteUser:', error);
      this.handleUserServiceError(error);
    }
  }

  validateUserId(id) {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('ID de usuario inválido');
    }
  }

  validateUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Datos de usuario inválidos');
    }

    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new Error('Email inválido');
    }

    if (userData.userName && userData.userName.trim().length < 3) {
      throw new Error('Nombre de usuario debe tener al menos 3 caracteres');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  handleUserServiceError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data;
      
      if (status === 401) {
        throw new Error('No autorizado para realizar esta acción');
      } else if (status === 403) {
        throw new Error('Acceso denegado para esta operación');
      } else if (status === 404) {
        throw new Error('Usuario no encontrado');
      } else if (status === 409) {
        throw new Error('Conflicto: El usuario ya existe o hay datos duplicados');
      } else if (status >= 500) {
        throw new Error('Error interno del servidor');
      } else {
        throw new Error(typeof message === 'string' ? message : 'Error en operación de usuario');
      }
    } else if (error.request) {
      throw new Error('Error de conexión con el servidor');
    } else {
      throw error;
    }
  }
}


const userService = new UserService();

export default userService;
