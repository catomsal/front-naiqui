import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../app/api.js'
import { useAuth } from '../context/useAuth.js'

function Register() {
	const [fields, setFields] = useState({
		username: '',
		nombre: '',
		apellido: '',
		rol: 'USUARIO',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	function handleChange(event) {
		setFields({
			...fields,
			[event.target.name]: event.target.value,
		})
		setError('')
	}

	async function handleSubmit(event) {
		event.preventDefault()
		if (fields.password !== fields.confirmPassword) {
			setError('Las contraseñas no coinciden')
			return
		}

		setError('')
		setIsLoading(true)
		try {
			const credentials = {
				username: fields.username.trim(),
				nombre: fields.nombre.trim(),
				apellido: fields.apellido.trim(),
				rol: fields.rol,
				email: fields.email.trim(),
				password: fields.password,
			}
			await apiRequest('/usuarios', {
				method: 'POST',
				body: JSON.stringify(credentials),
			})

			try {
				const session = await apiRequest('/login', {
					method: 'POST',
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
				})
				login(session)
				navigate(location.state?.from?.pathname || '/', { replace: true })
			} catch (loginError) {
				setError(`La cuenta se creó, pero no se pudo iniciar sesión automáticamente. Ingresá desde la pantalla de login. (${loginError.message})`)
			}
		} catch (requestError) {
			setError(requestError.message || 'No se pudo crear la cuenta')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main className="login-page">
			<Link className="navbar__brand" to="/">naiqui<span>.</span></Link>
			<div>
				<h1>Creá tu cuenta</h1>
				<p>Registrate para guardar tus favoritos y continuar tu compra.</p>
			</div>
			{error && <p className="page-error" role="alert">{error}</p>}
			<form onSubmit={handleSubmit}>
				<label htmlFor="rol">
					¿Qué querés hacer en Naiqui?
					<select
						id="rol"
						name="rol"
						value={fields.rol}
						onChange={handleChange}
						disabled={isLoading}
					>
						<option value="USUARIO">Comprar productos</option>
						<option value="VENDEDOR">Vender y publicar productos</option>
					</select>
				</label>
				<p className="muted">
					Si elegís vender, vas a poder publicar productos al crear tu cuenta.
				</p>
				<label htmlFor="nombre">
					Nombre
					<input
						type="text"
						id="nombre"
						name="nombre"
						autoComplete="name"
						value={fields.nombre}
						onChange={handleChange}
						placeholder="Tu nombre"
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="apellido">
					Apellido
					<input
						type="text"
						id="apellido"
						name="apellido"
						autoComplete="family-name"
						value={fields.apellido}
						onChange={handleChange}
						placeholder="Tu apellido"
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="username">
					Nombre de usuario
					<input
						type="text"
						id="username"
						name="username"
						autoComplete="username"
						minLength={3}
						maxLength={40}
						value={fields.username}
						onChange={handleChange}
						placeholder="tu_usuario"
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="email">
					Correo electrónico
					<input
						type="email"
						id="email"
						name="email"
						autoComplete="email"
						value={fields.email}
						onChange={handleChange}
						placeholder="tu@email.com"
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="password">
					Contraseña (mínimo 8 caracteres)
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="new-password"
						value={fields.password}
						onChange={handleChange}
						minLength={8}
						required
						disabled={isLoading}
					/>
				</label>
				<label htmlFor="confirmPassword">
					Confirmá tu contraseña
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						autoComplete="new-password"
						value={fields.confirmPassword}
						onChange={handleChange}
						minLength={8}
						required
						disabled={isLoading}
					/>
				</label>
				<button className="primary-button full-width" type="submit" disabled={isLoading}>
					{isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
				</button>
			</form>
			<p>¿Ya tenés cuenta? <Link className="text-link" to="/login">Iniciá sesión</Link></p>
			<Link className="text-link" to="/">Seguir explorando</Link>
		</main>
	)
}

export default Register
