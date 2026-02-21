import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User, UserState } from '@/types/Types.ts';
import $api, { setAccessToken } from '../../shared/axios.instance.ts';
import type { AxiosError } from 'axios';


type registrationInputType = { email: string, name: string, password: string, role: 'USER' | 'AUTHOR' }
type loginInputType = { email: string, password: string }
type updateProfileInputType = { name?: string, password?: string }
type rejected = { rejectValue: string }

const initialState: UserState = {
    isLoading: true
}

export const userAuthCheck = createAsyncThunk<User, void, rejected>('/auth', async (_, { rejectWithValue }) => {
    try {
        const { data } = await $api<{ message: string; user: User }>('/auth')
        return data.user
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        return rejectWithValue(err.response?.data.message ?? 'Register failed')
    }
})

export const userRegisterThunk = createAsyncThunk<User, registrationInputType, rejected>('/registration', async (userFd, { rejectWithValue }) => {
    try {
        const { data: { user, accessToken } } = await $api.post('/auth/registration', userFd)
        setAccessToken(accessToken)
        return user
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        return rejectWithValue(err.response?.data.message ?? 'Register failed')
    }
})

export const userLoginThunk = createAsyncThunk<User, loginInputType, rejected>('/login', async (userFd, { rejectWithValue }) => {
    try {
        const { data: { user, accessToken } } = await $api.post('/auth/login', userFd)
        setAccessToken(accessToken)
        return user
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        return rejectWithValue(err.response?.data.message ?? 'Register failed')
    }
})

export const userLogoutThunk = createAsyncThunk<void, void, rejected>('/logout', async (_, { rejectWithValue }) => {
    try {
        await $api.post('/auth/logout')
        return
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        return rejectWithValue(err.response?.data.message ?? 'Register failed')
    }
})

export const userUpdateProfileThunk = createAsyncThunk<User, updateProfileInputType, rejected>('/profile/update', async (profileData, { rejectWithValue }) => {
    try {
        const { data: { user, accessToken } } = await $api.patch('/auth/profile', profileData)
        setAccessToken(accessToken)
        return user
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        return rejectWithValue(err.response?.data.message ?? 'Profile update failed')
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userRegisterThunk.pending, (state) => {
                state.error = null
            })
            .addCase(userRegisterThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(userRegisterThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Register failed'
            })

            .addCase(userAuthCheck.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLoading = false
            })
            .addCase(userAuthCheck.rejected, (state) => {
                state.isLoading = false
            })

            .addCase(userLoginThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(userLoginThunk.rejected, (state) => {
                state.isLoading = false
            })

            .addCase(userLogoutThunk.fulfilled, (state) => {
                state.user = undefined
            })
            .addCase(userUpdateProfileThunk.fulfilled, (state, action) => {
                state.user = action.payload
            })
    }
})

export default userSlice.reducer
