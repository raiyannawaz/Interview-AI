import { supabase } from '@/supabaseClient'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { handleGetSession, handleGetUser } from '../user/userSlice'

export const handleSignUp = createAsyncThunk('auth/sign-up',
    async ({ name, email, password }, { rejectWithValue }) => {
        let { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
        
        if (error) {
            return rejectWithValue({ message: error.message, status: error.status })
        }
        return data
    })

export const handleSignIn = createAsyncThunk('auth/sign-in',
    async ({ email, password }, { rejectWithValue, dispatch }) => {

        let { data, error } = await supabase.auth.signInWithPassword({ 
            email, password,
            options: {
                emailRedirectTo: "https://raiyannawaz.github.io/Interview-AI/#/auth/callback"
            }
        })

        if (error) {
            return rejectWithValue(error)
        }

        await dispatch(handleGetSession())
        await dispatch(handleGetUser())
        return data
    })

export const handleSignOut = createAsyncThunk('auth/sign-out', async (_, { rejectWithValue }) => {

    const { error } = await supabase.auth.signOut()

    if (error) {
        return rejectWithValue({ message: error.message, status: error.status })
    }

    return true
})

const initialState = {
    loading: false,
    success: null,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleSignUp.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleSignUp.fulfilled, (state, action) => {
                state.loading = false
                state.success = { message: 'Please verify through your mail', type: 'sign-up' }
                state.error = null
            })
            .addCase(handleSignUp.rejected, (state, action) => {
                state.loading = false
                state.error = { message: action.payload.message, type: 'sign-up' }
                state.success = null
            })
            .addCase(handleSignIn.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleSignIn.fulfilled, (state, action) => {
                state.loading = false
                state.success = { message: 'Sign In Successful', type: 'sign-in' }
                state.error = null
            })
            .addCase(handleSignIn.rejected, (state, action) => {
                state.loading = false
                state.error = { message: action.payload.message, type: 'sign-in' }
                state.success = null
            })
            .addCase(handleSignOut.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleSignOut.fulfilled, (state, action) => {
                state.loading = false
                state.success = { message: 'Sign Out Successful', type: 'sign-out' }
                state.error = null
            })
            .addCase(handleSignOut.rejected, (state, action) => {
                state.loading = false
                state.error = { message: action.payload.message, type: 'sign-out' }
                state.success = null
            })
    }
})

export const { resetAuth } = authSlice.actions

export default authSlice.reducer