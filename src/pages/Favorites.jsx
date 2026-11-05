import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard.jsx'
import {
	clearFavorites,
	clearFavoritesOnServer,
	fetchFavorites,
} from '../store/slices/favoriteSlice.js'
import { useAuth } from '../context/useAuth.js'

function Favorites() {
	const dispatch = useDispatch()
	const { user } = useAuth()
	const favorites = useSelector((state) => state.favorite.items)
	const { error, loading } = useSelector((state) => state.favorite)

	function handleClear() {
		if (user?.id) {
			dispatch(clearFavoritesOnServer(user.id))
			return
		}
		dispatch(clearFavorites())
	}

	return (
		<main className="store-page">
			<div className="breadcrumbs">
				<Link to="/">Inicio</Link><span>/</span><span>Favoritos</span>
			</div>
			<header className="page-heading">
				<h1>Mis favoritos</h1>
				<p>{favorites.length} productos</p>
			</header>
			{error && favorites.length === 0 ? (
				<div>
					<p className="page-error" role="alert">{error}</p>
					{user?.id && (
						<button
							className="secondary-button"
							type="button"
							onClick={() => dispatch(fetchFavorites(user.id))}
						>
							Reintentar
						</button>
					)}
				</div>
			) : (
				<>
					{error && <p className="page-error" role="alert">{error}</p>}
					{favorites.length === 0 ? (
						<div className="empty-state">
							<h2>Todavía no guardaste favoritos</h2>
							<p>Guardá las zapatillas que te gustan para encontrarlas rápido.</p>
							<Link className="primary-button" to="/">Explorar catálogo</Link>
						</div>
					) : (
						<>
							<section className="product-grid" aria-label="Mis productos favoritos">
								{favorites.map((product) => <ProductCard key={product.id} product={product} />)}
							</section>
							<button
								className="secondary-button"
								type="button"
								onClick={handleClear}
								disabled={loading}
								style={{ marginTop: 20 }}
							>
								Vaciar favoritos
							</button>
						</>
					)}
				</>
			)}
		</main>
	)
}

export default Favorites
