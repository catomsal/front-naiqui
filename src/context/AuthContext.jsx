import { useState } from 'react'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)

	function login(username) {
		setUser({ username, rol: 'USER' })
	}

	function loginAdmin(username) {
		setUser({ username, rol: 'ADMIN' })
	}

	function logout() {
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, loginAdmin, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
