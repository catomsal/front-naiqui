import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { apiRequest } from '../app/api.js'

const demoAccounts = import.meta.env.DEV
	? [
		{ role: 'Usuario', email: 'demo@naiqui.com', password: '1234' },
		{ role: 'Vendedor', email: 'vendedor@naiqui.com', password: '1234' },
		{ role: 'Administrador', email: 'admin@naiqui.com', password: '1234' },
	]
	: []

function Login() {
	const [credentials, setCredentials] = useState({ email: '', password: '' })
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	function handleChange(event) {
		setCredentials({
			...credentials,
			[event.target.name]: event.target.value,
		})
	}

	async function signIn(nextCredentials) {
		setError('')
		setIsLoading(true)

		try {
			const data = await apiRequest('/login', {
				method: 'POST',
				body: JSON.stringify(nextCredentials),
			})
			login(data)
			navigate(location.state?.from?.pathname || '/', { replace: true })
		} catch (err) {
			setError(err.message || 'No se pudo iniciar sesión')
		} finally {
			setIsLoading(false)
		}
	}

	function handleSubmit(event) {
		event.preventDefault()
		signIn(credentials)
	}

	return (
		<main className="login-page">
			<Link className="navbar__brand" to="/">naiqui<span>.</span></Link>
			<div>
				<h1>Ingresá a tu cuenta</h1>
				<p>Continuá con tu compra y encontrá tus favoritos.</p>
			</div>
			{error && <p className="page-error" role="alert">{error}</p>}
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">
					Correo electrónico
					<input
						type="email"
						id="email"
						name="email"
						autoComplete="email"
						value={credentials.email}
						onChange={handleChange}
						placeholder="tu@email.com"
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="password">
					Contraseña
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="current-password"
						value={credentials.password}
						onChange={handleChange}
						placeholder="Tu contraseña"
						required
						disabled={isLoading}
					/>
				</label>
				<button className="primary-button full-width" type="submit" disabled={isLoading}>
					{isLoading ? 'Ingresando...' : 'Ingresar'}
				</button>
			</form>
			<p>¿Todavía no tenés cuenta? <Link className="text-link" to="/registro">Crear cuenta</Link></p>
			{demoAccounts.length > 0 && (
				<section className="demo-login" aria-labelledby="demo-login-title">
					<div className="demo-login__heading">
						<h2 id="demo-login-title">Accesos rápidos de demostración</h2>
						<p>Entrá con un rol de prueba con un solo click.</p>
					</div>
					<div className="demo-login__options" role="group" aria-label="Ingresar con un usuario demo">
						{demoAccounts.map((account) => (
							<button
								className="demo-login__button"
								key={account.role}
								type="button"
								onClick={() => signIn(account)}
								disabled={isLoading}
							>
								{isLoading ? 'Ingresando...' : `Entrar como ${account.role}`}
							</button>
						))}
					</div>
				</section>
			)}
			<Link className="text-link" to="/">Seguir explorando</Link>
		</main>
	)
}

export default Login
