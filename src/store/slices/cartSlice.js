import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../app/api.js'

function getCartItems(data) {
	if (!Array.isArray(data?.items)) {
		throw new Error('El servidor devolvió un carrito con un formato inesperado')
	}
	return data.items
}

export const fetchCartItems = createAsyncThunk(
	'cart/fetchCartItems',
	async (userId, { rejectWithValue }) => {
		try {
			const data = await apiRequest(`/usuarios/${userId}/carrito`)
			return getCartItems(data)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
	{
		condition: (_, { getState }) => !getState().cart.loading,
	},
)

export const addToCart = createAsyncThunk(
	'cart/addToCart',
	async ({ userId, productoId, talle, cantidad = 1 }, { rejectWithValue }) => {
		try {
			const data = await apiRequest(`/usuarios/${userId}/carrito/items`, {
				method: 'POST',
				body: JSON.stringify({ productoId, talle, cantidad }),
			})
			return getCartItems(data)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const updateCartItem = createAsyncThunk(
	'cart/updateCartItem',
	async ({ userId, itemId, cantidad }, { rejectWithValue }) => {
		try {
			const data = await apiRequest(
				`/usuarios/${userId}/carrito/items/${itemId}`,
				{
					method: 'PUT',
					body: JSON.stringify({ cantidad }),
				},
			)
			return getCartItems(data)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const removeCartItem = createAsyncThunk(
	'cart/removeCartItem',
	async ({ userId, itemId }, { rejectWithValue }) => {
		try {
			const data = await apiRequest(
				`/usuarios/${userId}/carrito/items/${itemId}`,
				{ method: 'DELETE' },
			)
			return getCartItems(data)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

export const clearCart = createAsyncThunk(
	'cart/clearCart',
	async (userId, { rejectWithValue }) => {
		try {
			await apiRequest(`/usuarios/${userId}/carrito`, { method: 'DELETE' })
			return []
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		items: [],
		loading: false,
		error: null,
		initialized: false,
	},
	reducers: {
		resetCart: (state) => {
			state.items = []
			state.error = null
			state.initialized = false
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCartItems.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchCartItems.fulfilled, (state, action) => {
				state.items = action.payload
				state.loading = false
				state.error = null
				state.initialized = true
			})
			.addCase(fetchCartItems.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload || action.error.message
				state.initialized = true
			})
			.addCase(addToCart.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.items = action.payload
				state.loading = false
				state.error = null
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload || action.error.message
			})
			.addCase(updateCartItem.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(updateCartItem.fulfilled, (state, action) => {
				state.items = action.payload
				state.loading = false
				state.error = null
			})
			.addCase(updateCartItem.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload || action.error.message
			})
			.addCase(removeCartItem.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(removeCartItem.fulfilled, (state, action) => {
				state.items = action.payload
				state.loading = false
				state.error = null
			})
			.addCase(removeCartItem.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload || action.error.message
			})
			.addCase(clearCart.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(clearCart.fulfilled, (state, action) => {
				state.items = action.payload
				state.loading = false
				state.error = null
			})
			.addCase(clearCart.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload || action.error.message
			})
	},
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
