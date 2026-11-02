import { useState } from 'react'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)

	// Recibe la respuesta de POST /api/login (LoginResponseDTO del back)
	function login(data) {
		// Guardamos el token JWT en localStorage para enviarlo en las rutas protegidas
		localStorage.setItem('token', data.token)
		setUser({ id: data.id, nombre: data.nombre, email: data.email, rol: data.rol })
	}

	function logout() {
		localStorage.removeItem('token')
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
