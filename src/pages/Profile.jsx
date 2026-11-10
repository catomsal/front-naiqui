import { useAuth } from '../context/useAuth.js'
import './Profile.css'

function Profile() {
	const { user } = useAuth()

	return (
		<main className="profile-page">
			<section className="profile-card">
				<header className="profile-card__header">
					<div className="profile-card__avatar" aria-hidden="true">
						{(user.nombre || user.email || 'U').charAt(0).toUpperCase()}
					</div>
					<div>
						<p className="profile-card__eyebrow">Tu cuenta</p>
						<h1>Mi perfil</h1>
						<p className="profile-card__intro">Tu información personal en Naiqui.</p>
					</div>
				</header>
				<div className="profile-card__details">
					<div className="profile-card__detail">
						<span>Nombre</span>
						<strong>{user.nombre || 'Sin nombre'}</strong>
					</div>
					<div className="profile-card__detail">
						<span>Correo electrónico</span>
						<strong>{user.email || 'No informado'}</strong>
					</div>
					<div className="profile-card__detail">
						<span>Tipo de cuenta</span>
						<strong className="profile-card__role">{user.rol || 'Usuario'}</strong>
					</div>
				</div>
			</section>
		</main>
	)
}

export default Profile
