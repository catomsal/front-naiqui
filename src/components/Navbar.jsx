import { useEffect } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/useAuth.js'
import { fetchCartItems, resetCart } from '../store/slices/cartSlice.js'
import { fetchFavorites, resetFavorites } from '../store/slices/favoriteSlice.js'
import './Navbar.css'

function Navbar() {
	const { user, logout } = useAuth()
	const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())
	const dispatch = useDispatch()
	const [searchParams, setSearchParams] = useSearchParams()
	// Suscripción al slice de favoritos y carrito de Redux del profesor
	const favoritesState = useSelector((state) => state.favorite)
	const favorites = favoritesState?.items || []
	const cartItems = useSelector((state) => state.cart?.items || [])
	const cartError = useSelector((state) => state.cart?.error)
	const cartCount = cartItems.reduce((total, item) => total + (item.cantidad || 1), 0)

	useEffect(() => {
		if (user?.id && !isStaff) {
			dispatch(fetchCartItems(user.id))
			dispatch(fetchFavorites(user.id))
		} else {
			dispatch(resetCart())
			dispatch(resetFavorites())
		}
	}, [dispatch, isStaff, user?.id])

	function handleSearch(event) {
		event.preventDefault()
		const query = new FormData(event.currentTarget).get('q')?.toString().trim()
		setSearchParams(query ? { ...Object.fromEntries(searchParams), q: query } : {})
	}

	return (
		<nav className="navbar">
			<Link to="/" className="navbar__brand">
				naiqui<span>.</span>
			</Link>
			<div className="navbar__categories">
				<NavLink to="/?genero=Hombre">Hombre</NavLink>
				<NavLink to="/?genero=Mujer">Mujer</NavLink>
				<NavLink to="/?genero=Ni%C3%B1os">Niños</NavLink>
				<NavLink to="/?ofertas=1">Ofertas</NavLink>
			</div>
			<form
				className="navbar__search"
				onSubmit={handleSearch}
				role="search"
				key={searchParams.toString()}
			>
				<input
					type="search"
					name="q"
					defaultValue={searchParams.get('q') || ''}
					placeholder="Buscar zapatillas"
					aria-label="Buscar zapatillas"
				/>
			</form>
			<div className="navbar__links">
				{user && !isStaff && (
					<>
						<NavLink to="/favoritos">
							<span className="navbar__icon" aria-hidden="true">
								<svg viewBox="0 0 24 24"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.5 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" /></svg>
							</span>
							Favoritos ({favorites.length})
						</NavLink>
						<NavLink to="/carrito">
							<span className="navbar__icon" aria-hidden="true">
								<svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
							</span>
							Carrito ({cartCount})
						</NavLink>
					</>
				)}
				{user && (
					<NavLink to="/pedidos">
						<span className="navbar__icon" aria-hidden="true">
							<svg viewBox="0 0 24 24"><path d="M7 3.75h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.75a1 1 0 0 1 1-1Z" /><path d="M14 4v4h4M9 12h6M9 16h6" /></svg>
						</span>
						{isStaff ? 'Pedidos' : 'Mis pedidos'}
					</NavLink>
				)}
				{user?.rol?.toUpperCase() === 'ADMIN' && (
					<NavLink to="/usuarios">
						<span className="navbar__icon" aria-hidden="true">
							<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20ZM17 8h4M19 6v4M17 16h4M17 19h4" /></svg>
						</span>
						Usuarios
					</NavLink>
				)}
				{user ? (
					<>
						<NavLink to="/perfil" className="navbar__account">
							{user.nombre}
						</NavLink>
						<button className="navbar__logout" onClick={logout} type="button">
							Salir
						</button>
					</>
				) : (
					<NavLink to="/login">
						<span className="navbar__icon" aria-hidden="true">
							<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" /></svg>
						</span>
						Ingresar
					</NavLink>
				)}
			</div>
			{(cartError || favoritesState.error) && (
				<p className="navbar__error" role="alert">{cartError || favoritesState.error}</p>
			)}
		</nav>
	)
}

export default Navbar
