import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../api/services/AuthService'


const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false, 
}


export const loginThunk = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const result = await authService.login(loginData)
      return {
        user: result.user,
        token: result.token,
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
        const user = authService.getUser()
        const token = authService.getToken()
        
        return {
          user,
          token,
          isAuthenticated: true
        }
      } else {

        authService.clearAuthData()
        return {
          user: null,
          token: null,
          isAuthenticated: false
        }
      }
    } catch {
      authService.clearAuthData()
      return rejectWithValue('Error verificando autenticación')
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
  }
})


export const { clearError, clearAuth, setInitialized } = authSlice.actions


export default authSlice.reducer