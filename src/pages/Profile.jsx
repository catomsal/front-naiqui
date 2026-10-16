import { useAuth } from '../context/useAuth.js'

function Profile() {
	const { user } = useAuth()

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Usuario</p>
				<h1>Mi perfil</h1>
			</header>
			{/* Operador ||: valor alternativo si el dato no viene del back */}
			<p>Nombre: {user.nombre || 'Sin nombre'}</p>
			<p>Email: {user.email}</p>
			<p>Rol: {user.rol}</p>
		</main>
	)
}

export default Profile
