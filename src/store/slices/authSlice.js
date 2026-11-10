import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../app/api.js'

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials, { rejectWithValue }) => {
		try {
			return await apiRequest('/login', {
				method: 'POST',
				body: JSON.stringify(credentials),
			})
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.user = null
			state.isAuthenticated = false
			state.error = null
		},
		clearError: (state) => {
			state.error = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.user = action.payload
				state.isAuthenticated = true
				state.error = null
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
				state.isAuthenticated = false
			})
	},
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
