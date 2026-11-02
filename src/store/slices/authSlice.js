import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Crear una acción asincrónica para el login que llama al endpoint real
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  // credentials es un objeto con email y password que se envía desde el componente LoginJWT.jsx
  // rejectWithValue es una función que permite manejar errores de forma más limpia en el bloque catch, devolviendo un valor personalizado que se puede acceder en el reducer cuando la acción es rechazada (rejected)
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || 'Error al iniciar sesión');
      }

      // Si el backend devuelve JSON (LoginResponseDTO) o texto plano con el token
      const contentType = response.headers.get('content-type') || '';
      let token = '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        token = data.token || (typeof data === 'string' ? data : JSON.stringify(data));
      } else {
        token = await response.text();
      }

      console.log('Respuesta del backend:', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null, // JWT token
    isAuthenticated: Boolean(localStorage.getItem('token')),
    isLoading: false,
    error: null,
  },
  reducers: {
    // Acción para limpiar el estado en logout
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    // Acción para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Maneja los estados de la acción asincrónica loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        if (action.payload) {
          localStorage.setItem('token', action.payload);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
