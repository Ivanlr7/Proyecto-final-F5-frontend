import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../api/services/AuthService'
import userService from '../../api/services/UserService'


const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  role: null,
  isInitialized: false, 
}
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}


export const loginThunk = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const result = await authService.login(loginData);
      // Decodificar el token y extraer el rol (scope)
      const payload = parseJwt(result.token);
      let role = null;
      if (payload && payload.scope) {
        // Si hay varios roles, toma el primero o puedes guardar el array
        role = payload.scope.split(' ').map(r => r.replace('ROLE_', '').toLowerCase());
      }
      return {
        user: result.user,
        token: result.token,
        role,
        message: result.message
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.logout()
      return result
    } catch (error) {
 
      return rejectWithValue(error.message)
    }
  }
)

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated) {
        const user = authService.getUser();
        const token = authService.getToken();
        // Decodificar el token y extraer el rol (scope)
        const payload = parseJwt(token);
        let role = null;
        if (payload && payload.scope) {
          role = payload.scope.split(' ').map(r => r.replace('ROLE_', '').toLowerCase());
        }
        return {
          user,
          token,
          role,
          isAuthenticated: true
        }
      } else {
        authService.clearAuthData();
        return {
          user: null,
          token: null,
          role: null,
          isAuthenticated: false
        }
      }
    } catch {
      authService.clearAuthData()
      return rejectWithValue('Error verificando autenticación')
    }
  }
)

// Thunk para actualizar el usuario
export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async ({ id, userData, token }, { rejectWithValue }) => {
    try {
      const result = await userService.updateUser(id, userData, token);
      if (result.success && result.data) {
        return result.data;
      } else {
        return rejectWithValue(result.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar usuario');
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
 
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = null
      state.loading = false
    },
    setInitialized: (state) => {
      state.isInitialized = true
    }
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.role;
        state.error = null
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
      
    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = null
      })
      .addCase(logoutThunk.rejected, (state, action) => {
    
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
      

    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = action.payload.isAuthenticated
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.role;
        state.isInitialized = true
        state.error = null
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.isInitialized = true
        state.error = action.payload
      })
      
    builder
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
})


export const { clearError, clearAuth, setInitialized } = authSlice.actions


export default authSlice.reducer