import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../context/useAuth.js'
import { selectFavoritesCount } from '../features/favorites/favoritesSlice.js'
import './Navbar.css'

function Navbar() {
	const { user, logout } = useAuth()
	const favoritesCount = useSelector(selectFavoritesCount)

	return (
		<nav className="navbar">
			<Link to="/" className="navbar__brand">
				naiqui
			</Link>
			<div className="navbar__links">
				<NavLink to="/">Catálogo</NavLink>
				<NavLink to="/favoritos">Favoritos ({favoritesCount})</NavLink>
				<NavLink to="/carrito">Carrito</NavLink>
				<NavLink to="/pedidos">Pedidos</NavLink>
				{user ? (
					<>
						<NavLink to="/perfil">Perfil</NavLink>
						<button className="navbar__logout" onClick={logout}>
							Salir
						</button>
					</>
				) : (
					<NavLink to="/login">Ingresar</NavLink>
				)}
			</div>
		</nav>
	)
}

export default Navbar
