import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/carrito';

// Extraer items adaptándose a si el backend devuelve un CarritoDTO o una lista de items
const extraerItems = (data) => {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0].items)) {
      return data[0].items;
    }
    return data;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
};

// createAsyncThunk para obtener los items del carrito desde la API
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        credentials: 'include',
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }
      const data = await response.json();
      return extraerItems(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// createAsyncThunk para agregar un producto (zapatilla) e impactar en DB
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      const payload = {
        productoId: product.productoId || product.id,
        talle: product.talle || 40,
        cantidad: product.cantidad || 1,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || 'Error al agregar al carrito');
      }

      const data = await response.json();
      return extraerItems(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// cartSlice cumple la función del CartProvider en useContext
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // listado de productos en el carrito
    items: [],
    total: 0,
    loading: false,
    error: null
  },

  reducers: {
    // Acciones sincrónicas locales
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    }
  },

  // extraReducers maneja las acciones generadas por createAsyncThunk (fetchCartItems y addToCart)
  extraReducers: (builder) => {
    builder
      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
