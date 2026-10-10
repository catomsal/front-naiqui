import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import './Navbar.css'

function Navbar() {
	const { user, logout } = useAuth()

	return (
		<nav className="navbar">
			<Link to="/" className="navbar__brand">
				naiqui
			</Link>
			<div className="navbar__links">
				<NavLink to="/">Catálogo</NavLink>
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
