import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../app/api.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const authVersion = useRef(0)

	useEffect(() => {
		let isMounted = true
		const requestVersion = authVersion.current
		localStorage.removeItem('token')
		localStorage.removeItem('naiqui_user')

		apiRequest('/me')
			.then((session) => {
				if (isMounted && requestVersion === authVersion.current) setUser(session)
			})
			.catch(() => {
				if (isMounted && requestVersion === authVersion.current) setUser(null)
			})
			.finally(() => {
				if (isMounted && requestVersion === authVersion.current) setIsLoading(false)
			})

		return () => {
			isMounted = false
		}
	}, [])

	function login(data) {
		authVersion.current += 1
		const authenticatedUser = {
			id: data.id,
			nombre: data.nombre,
			email: data.email,
			rol: data.rol,
		}
		setUser(authenticatedUser)
		setIsLoading(false)
	}

	async function logout() {
		try {
			await apiRequest('/logout', { method: 'POST' })
		} finally {
			authVersion.current += 1
			setUser(null)
			localStorage.removeItem('token')
			localStorage.removeItem('naiqui_user')
		}
	}

	function updateUser(updatedUser) {
		setUser((currentUser) => currentUser && { ...currentUser, ...updatedUser })
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	)
}
