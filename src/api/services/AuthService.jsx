import AuthRepository from "../repositories/AuthRepository";

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.tokenKey = 'reviewverso_token';
    this.userKey = 'reviewverso_user';
  }

  async login(loginData) {
    try {
  
      this.validateLoginData(loginData);

 
      const result = await this.authRepository.login(loginData);

      if (result.success && result.data.token) {
   
        this.setToken(result.data.token);
        
    
        const userInfo = this.decodeTokenPayload(result.data.token);
        if (userInfo) {
          this.setUser(userInfo);
        }

        return {
          success: true,
          message: 'Login exitoso',
          token: result.data.token,
          user: userInfo
        };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      console.error('Error en el servicio de login:', error);
      
    
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;
        
        if (status === 401) {
          throw new Error(typeof message === 'string' ? message : 'Credenciales inválidas');
        } else if (status === 400) {
          throw new Error('Datos de login inválidos');
        } else if (status >= 500) {
          throw new Error('Error interno del servidor');
        } else {
          throw new Error(typeof message === 'string' ? message : 'Error en el login');
        }
      } else if (error.request) {
        throw new Error('Error de conexión con el servidor');
      } else {
        throw error;
      }
    }
  }

  async logout() {
    try {
      const token = this.getToken();
      

      if (token) {
        try {
          await this.authRepository.logout(token);
        } catch (error) {
  
          console.warn('Error al invalidar token en servidor:', error.message);
        }
      }

      this.clearAuthData();
      
      return {
        success: true,
        message: 'Logout exitoso'
      };
    } catch (error) {
      console.error('Error en logout:', error);

      this.clearAuthData();
      throw new Error('Error al cerrar sesión');
    }
  }

  validateLoginData(loginData) {
    const errors = [];


    if (!loginData.identifier || loginData.identifier.trim().length === 0) {
      errors.push('El email o nombre de usuario es requerido');
    }


    if (!loginData.password || loginData.password.length === 0) {
      errors.push('La contraseña es requerida');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    return token && this.isTokenValid(token);
  }

  decodeTokenPayload(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  isTokenValid(token) {
    try {
      const payload = this.decodeTokenPayload(token);
      if (!payload || !payload.exp) return false;
      

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  getTokenExpiration(token) {
    try {
      const payload = this.decodeTokenPayload(token);
      if (!payload || !payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

const authService = new AuthService();

export default authService;
