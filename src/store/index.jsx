import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {

        ignoredActions: ['auth/checkAuth/fulfilled'],
      },
    }),
})

export default store