import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../app/api.js'

function getUser(session) {
	return {
		id: session.id,
		username: session.username,
		nombre: session.nombre,
		apellido: session.apellido,
		email: session.email,
		rol: session.rol,
	}
}


// Thunk que restaura la sesión al abrir o recargar la app.
// Llama a GET /api/me: el navegador envía solo la cookie HttpOnly con el JWT,
// y si es válida el backend devuelve el usuario. Se despacha desde App.jsx.

export const restoreSession = createAsyncThunk(
	'auth/restoreSession',
	() => apiRequest('/me'),
)


// Thunk de login: envía las credenciales a POST /api/login.
// Si salen bien, el backend responde con el usuario y setea la cookie HttpOnly.

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	(credentials) => apiRequest('/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
	}),
)

export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async () => {
		await apiRequest('/logout', { method: 'POST' })
	},
)


// Slice de autenticación. El estado vive en memoria (se pierde al recargar);
// por eso al iniciar la app se dispara restoreSession.
// - user: usuario logueado (null si no hay sesión)
// - isLoading: true mientras se verifica la sesión, para no redirigir al login antes de tiempo
// - error: mensaje del último fallo de login o logout

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isLoading: true,
		error: null,
		sessionChanged: false,
	},
	reducers: {
		setSession: (state, action) => {
			state.user = getUser(action.payload)
			state.isLoading = false
			state.error = null
			state.sessionChanged = true
		},
		updateSession: (state, action) => {
			if (state.user) state.user = { ...state.user, ...action.payload }
		},
		clearError: (state) => {
			state.error = null
		},
	},

	// Cada thunk tiene tres estados: pending (en curso), fulfilled (salió bien) y rejected (falló).
	extraReducers: (builder) => {
		builder
			.addCase(restoreSession.pending, (state) => {
				state.isLoading = true
			})
			.addCase(restoreSession.fulfilled, (state, action) => {
				if (!state.sessionChanged) state.user = getUser(action.payload)
				state.isLoading = false
			})
			.addCase(restoreSession.rejected, (state) => {
				if (!state.sessionChanged) state.user = null
				state.isLoading = false
			})
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true
				state.error = null
				state.sessionChanged = true
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = getUser(action.payload)
				state.isLoading = false
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.error.message || 'No se pudo iniciar sesión'
			})
			.addCase(logoutUser.pending, (state) => {
				state.sessionChanged = true
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null
				state.isLoading = false
				state.error = null
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.error = action.error.message || 'No se pudo cerrar sesión'
			})
	},
})

export const { setSession, updateSession, clearError } = authSlice.actions
export default authSlice.reducer
