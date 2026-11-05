import { useState } from 'react'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('naiqui_user')
		if (!savedUser) return null

		try {
			return JSON.parse(savedUser)
		} catch (error) {
			console.error('No se pudo recuperar la sesión de Naiqui:', error)
			localStorage.removeItem('naiqui_user')
			localStorage.removeItem('token')
			return null
		}
	})

	// Recibe la respuesta de POST /api/login (LoginResponseDTO del back)
	function login(data) {
		// Guardamos el token JWT en localStorage para enviarlo en las rutas protegidas
		localStorage.setItem('token', data.token)
		const authenticatedUser = {
			id: data.id,
			nombre: data.nombre,
			email: data.email,
			rol: data.rol,
		}
		localStorage.setItem('naiqui_user', JSON.stringify(authenticatedUser))
		setUser(authenticatedUser)
	}

	function logout() {
		localStorage.removeItem('token')
		localStorage.removeItem('naiqui_user')
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
