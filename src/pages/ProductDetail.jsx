import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FavoriteButton from '../components/FavoriteButton.jsx'
import ShoePlaceholder from '../components/ShoePlaceholder.jsx'
import { apiRequest } from '../app/api.js'
import { formatPrice } from '../app/format.js'
import { addToCart } from '../store/slices/cartSlice.js'
import { useAuth } from '../context/useAuth.js'

const sizes = [38, 39, 40, 41, 42, 43]

function ProductDetail() {
	const { id } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const { user } = useAuth()
	const cartLoading = useSelector((state) => state.cart.loading)
	const [productState, setProductState] = useState({ id: null, product: null, error: null })
	const [selectedSize, setSelectedSize] = useState(40)
	const [actionError, setActionError] = useState('')
	const [added, setAdded] = useState(false)

	useEffect(() => {
		let isCurrent = true
		apiRequest(`/productos/${id}`)
			.then((data) => {
				if (isCurrent) setProductState({ id, product: data, error: null })
			})
			.catch((err) => {
				if (isCurrent) setProductState({ id, product: null, error: err.message })
			})
		return () => {
			isCurrent = false
		}
	}, [id])

	const loading = productState.id !== id
	const product = loading ? null : productState.product
	const error = loading ? null : productState.error
	const hasDiscount = Number(product?.precioOriginal) > Number(product?.precio)
	const discount = hasDiscount
		? Math.round((1 - Number(product.precio) / Number(product.precioOriginal)) * 100)
		: 0

	async function handleAddToCart() {
		if (!user) {
			navigate('/login', { state: { from: location } })
			return
		}

		setActionError('')
		setAdded(false)
		try {
			await dispatch(
				addToCart({
					userId: user.id,
					productoId: product.id,
					talle: selectedSize,
					cantidad: 1,
				}),
			).unwrap()
			setAdded(true)
		} catch (err) {
			setActionError(err || 'No se pudo agregar el producto al carrito')
		}
	}

	if (loading) {
		return <main className="store-page"><p className="muted">Cargando producto...</p></main>
	}

	if (error || !product) {
		return (
			<main className="store-page">
				<p className="page-error" role="alert">{error || 'No encontramos este producto.'}</p>
				<Link className="text-link" to="/">Volver al catálogo</Link>
			</main>
		)
	}

	return (
		<main className="store-page">
			<div className="breadcrumbs">
				<Link to="/">Inicio</Link>
				<span>/</span>
				<Link to={`/categoria/${product.categoriaId}`}>{product.categoriaNombre || 'Zapatillas'}</Link>
				<span>/</span>
				<span>{product.nombre}</span>
			</div>

			<div className="product-detail">
				<div className="product-gallery">
					<div className="product-gallery__main">
						{product.imagenUrl ? (
							<img src={product.imagenUrl} alt={product.nombre} />
						) : (
							<ShoePlaceholder />
						)}
					</div>
					<div className="product-gallery__thumbs" aria-hidden="true">
						{sizes.slice(0, 4).map((size) => (
							<div className="product-gallery__thumb" key={size}>
								<ShoePlaceholder />
							</div>
						))}
					</div>
				</div>

				<section className="product-info">
					<p className="product-info__category">
						{product.categoriaNombre || 'Zapatillas'} · {product.genero || 'Unisex'}
					</p>
					<div className="product-info__heading">
						<div>
							<h1>{product.nombre}</h1>
							<div className="product-info__price-group">
								{hasDiscount && (
									<>
										<del className="product-info__old-price">{formatPrice(product.precioOriginal)}</del>
										<span className="product-info__discount">{discount}% OFF</span>
									</>
								)}
								<p className="product-info__price">{formatPrice(product.precio)}</p>
							</div>
						</div>
						<FavoriteButton product={product} />
					</div>
					<p className="product-info__description">{product.descripcion}</p>

					<div className="product-option">
						<div className="product-option__heading">
							<span>Color</span>
							<span className="muted">{product.color || 'Único'}</span>
						</div>
						<div className="product-color" aria-label={`Color ${product.color || 'único'}`}>
							<span />
						</div>
					</div>

					<fieldset className="product-option">
						<legend className="product-option__heading">
							<span>Talle (AR)</span>
							<a className="text-link" href="#guia-de-talles">Guía de talles</a>
						</legend>
						<div className="size-options">
							{sizes.map((size) => (
								<label className="size-option" key={size}>
									<input
										type="radio"
										name="size"
										value={size}
										checked={selectedSize === size}
										onChange={() => setSelectedSize(size)}
									/>
									<span>{size}</span>
								</label>
							))}
						</div>
					</fieldset>

					{actionError && <p className="page-error" role="alert">{actionError}</p>}
					{added && <p className="page-success" role="status">Agregada al carrito.</p>}
					<div className="product-info__actions">
						<button
							className="primary-button full-width"
							type="button"
							onClick={handleAddToCart}
							disabled={cartLoading || product.stock <= 0}
						>
							{product.stock <= 0
								? 'Sin stock'
								: cartLoading
									? 'Agregando...'
									: 'Agregar al carrito'}
						</button>
						<Link className="secondary-button full-width" to="/favoritos">
							♡ &nbsp; Ver mis favoritos
						</Link>
					</div>
					<div className="product-info__policies">
						<span>Envíos coordinados para cada compra.</span>
						<span>Cambios y devoluciones sujetos a disponibilidad.</span>
					</div>
					<span id="guia-de-talles" className="sr-only">Los talles disponibles van del 38 al 43.</span>
				</section>
			</div>
		</main>
	)
}

export default ProductDetail
