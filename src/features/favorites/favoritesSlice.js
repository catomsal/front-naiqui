import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../app/api.js'

export const fetchFavorites = createAsyncThunk(
	'favorites/fetchFavorites',
	async (usuarioId, { rejectWithValue }) => {
		try {
			return await apiRequest(`/usuarios/${usuarioId}/favoritos`)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const addFavoriteServer = createAsyncThunk(
	'favorites/addFavoriteServer',
	async ({ usuarioId, product }, { rejectWithValue }) => {
		try {
			return await apiRequest(`/usuarios/${usuarioId}/favoritos/${product.id}`, {
				method: 'POST',
			})
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const removeFavoriteServer = createAsyncThunk(
	'favorites/removeFavoriteServer',
	async ({ usuarioId, productId }, { rejectWithValue }) => {
		try {
			return await apiRequest(`/usuarios/${usuarioId}/favoritos/${productId}`, {
				method: 'DELETE',
			})
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

const initialState = {
	items: [],
	status: 'idle',
	error: null,
}

const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		setFavorites: (state, action) => {
			state.items = action.payload || []
		},
		toggleFavoriteLocal: (state, action) => {
			const product = action.payload
			const exists = state.items.find((item) => item.id === product.id)
			if (exists) {
				state.items = state.items.filter((item) => item.id !== product.id)
			} else {
				state.items.push(product)
			}
		},
		removeFavoriteLocal: (state, action) => {
			state.items = state.items.filter((item) => item.id !== action.payload)
		},
		clearFavorites: (state) => {
			state.items = []
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFavorites.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchFavorites.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.items = action.payload || []
			})
			.addCase(fetchFavorites.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload || 'Error al cargar favoritos'
			})
			.addCase(addFavoriteServer.fulfilled, (state, action) => {
				state.items = action.payload || []
			})
			.addCase(removeFavoriteServer.fulfilled, (state, action) => {
				state.items = action.payload || []
			})
			.addCase(addFavoriteServer.rejected, (state, action) => {
				state.error = action.payload || 'Error al agregar favorito'
			})
			.addCase(removeFavoriteServer.rejected, (state, action) => {
				state.error = action.payload || 'Error al quitar favorito'
			})
	},
})

export const { setFavorites, toggleFavoriteLocal, removeFavoriteLocal, clearFavorites } =
	favoritesSlice.actions

export const selectFavorites = (state) => state.favorites.items
export const selectFavoritesCount = (state) => state.favorites.items.length
export const selectFavoritesStatus = (state) => state.favorites.status
export const selectFavoritesError = (state) => state.favorites.error
export const selectIsFavorite = (productId) => (state) =>
	state.favorites.items.some((item) => item.id === productId)

export default favoritesSlice.reducer
