// maneja el estado de los productos favoritos usando Redux Toolkit, similar a como lo harías con useContext pero con la ventaja de tener un store global y acciones predefinidas para modificar el estado de forma más estructurada y escalable.
// reemplaza al FavoriteContext o FavoriteProvider que usarías con useContext para manejar los favoritos

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../app/api.js'

export const fetchFavorites = createAsyncThunk(
	'favorite/fetchFavorites',
	async (userId, { rejectWithValue }) => {
		try {
			return await apiRequest(`/usuarios/${userId}/favoritos`)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const toggleFavoriteOnServer = createAsyncThunk(
	'favorite/toggleOnServer',
	async ({ userId, product, isFavorite }, { rejectWithValue }) => {
		try {
			return await apiRequest(
				`/usuarios/${userId}/favoritos/${product.id}`,
				{ method: isFavorite ? 'DELETE' : 'POST' },
			)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const clearFavoritesOnServer = createAsyncThunk(
	'favorite/clearOnServer',
	async (userId, { getState, rejectWithValue }) => {
		try {
			const { items } = getState().favorite
			await Promise.all(
				items.map((product) =>
					apiRequest(`/usuarios/${userId}/favoritos/${product.id}`, {
						method: 'DELETE',
					}),
				),
			)
			return []
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        // opcional: toggleFavorite agrega o elimina un producto de favoritos dependiendo de si ya está o no en el array items. Es una función más cómoda para usar en la UI, por ejemplo, para un botón de "Agregar/Eliminar de favoritos" que cambia su estado al hacer clic.
        toggleFavorite: (state, action) => {
            const product = action.payload;
            const index = state.items.findIndex(item => item.id === product.id);

            if (index >= 0) {
                // Si ya existe, lo eliminamos
                state.items.splice(index, 1);
            } else {
                // Si no existe, lo agregamos
                state.items.push(product);
            }
        },
        // action.payload = { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
        addFavorite: (state, action) => {
            state.items.push(action.payload);
        },

        // action.payload = id del producto que quieres eliminar
        removeFavorite: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

        // Vacía el array items, eliminando todos los productos favoritos
        clearFavorites: (state) => {
            state.items = [];
            state.error = null
        },
        resetFavorites: (state) => {
            state.items = []
            state.error = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(toggleFavoriteOnServer.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(toggleFavoriteOnServer.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(toggleFavoriteOnServer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(clearFavoritesOnServer.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(clearFavoritesOnServer.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(clearFavoritesOnServer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
});

export const { addFavorite, removeFavorite, clearFavorites, toggleFavorite, resetFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
