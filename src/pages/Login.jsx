import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Login() {
	const [credentials, setCredentials] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()

	function handleChange(event) {
		setCredentials({
			...credentials,
			[event.target.name]: event.target.value,
		})
	}

	// async/await: la función espera la respuesta del back sin bloquear la UI
	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setIsLoading(true)

		try {
			const response = await fetch('http://localhost:8080/api/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
				mode: 'cors',
			})

			const data = await response.json()

			// Si la respuesta no es exitosa (ej: 401), lanzamos un error con el mensaje del back
			if (!response.ok) {
				throw new Error(data.mensaje || 'Error al iniciar sesión')
			}

			login(data)
			navigate('/')
		} catch (err) {
			setError(err.message)
		} finally {
			// Se ejecuta siempre, haya éxito o error
			setIsLoading(false)
		}
	}

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Acceso</p>
				<h1>Ingresar</h1>
			</header>
			{/* Renderizado condicional con &&: solo se muestra si hay error */}
			{error && <p className="catalog__message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					value={credentials.email}
					onChange={handleChange}
					placeholder="Email"
					required
					disabled={isLoading}
				/>
				<input
					type="password"
					name="password"
					value={credentials.password}
					onChange={handleChange}
					placeholder="Contraseña"
					required
					disabled={isLoading}
				/>
				{/* Renderizado condicional con operador ternario */}
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Ingresando...' : 'Ingresar'}
				</button>
			</form>
		</main>
	)
}

export default Login
