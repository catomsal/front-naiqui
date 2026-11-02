import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../context/useAuth.js'
import './Navbar.css'

function Navbar() {
	const { user, logout } = useAuth()
	// Suscripción al slice de favoritos y carrito de Redux del profesor
	const favorites = useSelector((state) => state.favorite?.items || [])
	const cartItems = useSelector((state) => state.cart?.items || [])

	return (
		<nav className="navbar">
			<Link to="/" className="navbar__brand">
				naiqui
			</Link>
			<div className="navbar__links">
				<NavLink to="/">Catálogo</NavLink>
				<NavLink to="/favoritos">Favoritos ({favorites.length})</NavLink>
				<NavLink to="/carrito">Carrito ({cartItems.length})</NavLink>
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
