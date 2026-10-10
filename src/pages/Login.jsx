import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Login() {
	const [username, setUsername] = useState('')
	const { login } = useAuth()
	const navigate = useNavigate()

	function handleSubmit(event) {
		event.preventDefault()
		if (username.trim()) {
			login(username)
			navigate('/')
		}
	}

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Acceso</p>
				<h1>Ingresar</h1>
			</header>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					placeholder="Usuario"
				/>
				<button type="submit">Ingresar</button>
			</form>
		</main>
	)
}

export default Login
