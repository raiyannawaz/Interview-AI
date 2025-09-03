import { supabase } from '@/supabaseClient'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const handleGetSession = createAsyncThunk('user/get-session', async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
        return rejectWithValue({ message: error.message })
    }

    return { token: data.session?.access_token }
})

export const handleGetUser = createAsyncThunk('user/get-user', async (_, { rejectWithValue }) => {
    let { data, error } = await supabase.auth.getUser()

    if (error) {
        return rejectWithValue({ message: error.message })
    }

    return { user: data.user }
})

const handleUploadImage = async (image) => {

    let CLOUD_NAME = import.meta.env.VITE_APP_CLOUD_NAME

    try {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'my_app_preset')
        formData.append('folder', 'Interview_AI/user_images')

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': "multipart/form-data"
                }
            }
        )

        let imageUrl = response.data.secure_url;
        return imageUrl
    }
    catch (err) {
        return err
    }
}

export const handleUpdateUser = createAsyncThunk('user/update-user', async (formData, { rejectWithValue }) => {

    let userData = { data: {} }

    if (formData.name) {
        userData.data.name = formData.name
    }

    if (formData.email) {
        userData.email = formData.email
    }

    if (formData.image) {
        let imageUrl = await handleUploadImage(formData.image)
        userData.data.avatar_url = imageUrl
    }

    let { data, error } = await supabase.auth.updateUser(userData, 
        {emailRedirectTo: 'https://raiyannawaz.github.io/Interview-AI/#/auth/callback'}
    )

    if (error) {
        return rejectWithValue({  message: error.message })
    }

    return { ...data, message: formData.currentEmail !== formData.email ? 'Please confirm your new mail id' : 'User updated' }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: true, token: null, success: null,
        user: null, error: null, editMode: false
    },
    reducers: {
        setEditMode: (state, action) => {
            state.editMode = action.payload
        },
        resetAlert: (state, action) => {
            state.error = null;
            state.success = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleGetSession.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleGetSession.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.token || null
            })
            .addCase(handleGetSession.rejected, (state, action) => {
                state.loading = false
                state.error = { message: action.payload.message, type: 'get-session' }
            })
            .addCase(handleGetUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleGetUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user || null
            })
            .addCase(handleGetUser.rejected, (state, action) => {
                state.loading = false
                state.error = { message: action.payload.message, type: 'get-user' }
            })
            .addCase(handleUpdateUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleUpdateUser.fulfilled, (state, action) => {
                state.user = action.payload.user || null
                state.success = { message: action.payload.message, type: 'update-user' }
                state.editMode = false
                state.loading = false
            })
            .addCase(handleUpdateUser.rejected, (state, action) => {
                state.editMode = false
                state.loading = false
                state.error = { message: action.payload.message, type: 'update-user' }
            })
    }
})

export const { setEditMode, resetAlert } = userSlice.actions

export default userSlice.reducer