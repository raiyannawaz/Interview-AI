import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import userReducer from './features/user/userSlice'
import interviewReducer from './features/interview/interviewSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        interview: interviewReducer
    }
})