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
const colorValues = {
	negro: '#272727',
	blanco: '#ffffff',
	gris: '#888888',
	azul: '#2563eb',
	rojo: '#dc2626',
	verde: '#16803c',
	'marrón': '#8b5e3c',
	'bordó': '#7f1d3f',
	amarillo: '#facc15',
	crema: '#e8dcc5',
}

function getColorValue(color) {
	return colorValues[color?.toLocaleLowerCase('es-AR')] || '#a8a29e'
}

function ProductDetail() {
	const { id } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const { user } = useAuth()
	const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())
	const cartLoading = useSelector((state) => state.cart.loading)
	const [productState, setProductState] = useState({ id: null, product: null, error: null })
	const [colorChoice, setColorChoice] = useState({ productId: null, color: null })
	const [sizeChoice, setSizeChoice] = useState({ productId: null, size: null })
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
	const categoryLabel = product?.categoriaNombre || 'Zapatillas'
	const variants = product?.variantes || []
	const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))]
	const defaultColor = variants.some((variant) => variant.color === product?.color)
		? product.color
		: variants[0]?.color || product?.color || ''
	const selectedColor = colorChoice.productId === product?.id ? colorChoice.color : defaultColor
	const defaultSize = variants.find(
		(variant) => variant.color === selectedColor && Number(variant.stock) > 0,
	)?.talle || 40
	const selectedSize = sizeChoice.productId === product?.id ? sizeChoice.size : Number(defaultSize)
	const selectedVariant = variants.find(
		(variant) => variant.color === selectedColor && Number(variant.talle) === selectedSize,
	)
	const selectedStock = variants.length
		? Number(selectedVariant?.stock || 0)
		: Number(product?.stock || 0)
	const genderLabel = product?.genero || 'Unisex'
	const categoryText =
		categoryLabel.toLocaleLowerCase('es-AR') === genderLabel.toLocaleLowerCase('es-AR')
			? categoryLabel
			: `${categoryLabel} · ${genderLabel}`

	function handleBack() {
		if (location.key === 'default') {
			navigate('/')
		} else {
			navigate(-1)
		}
	}

	async function handleAddToCart() {
		if (isStaff) {
			setActionError('Las cuentas de vendedor y administrador no pueden comprar productos.')
			return
		}
		if (!selectedVariant || selectedStock <= 0) {
			setActionError(`No hay stock disponible para el talle ${selectedSize} y el color seleccionado.`)
			return
		}
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
					color: selectedColor,
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
			<button
				type="button"
				className="back-button"
				onClick={handleBack}
				aria-label="Volver a la página anterior"
			>
				<span className="back-button__arrow" aria-hidden="true">←</span>
				Volver
			</button>

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
				</div>

				<section className="product-info">
					<p className="product-info__category">{categoryText}</p>
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
						{!isStaff && <FavoriteButton product={product} />}
					</div>
					<p className="product-info__description">{product.descripcion}</p>

					<div className="product-option">
						<div className="product-option__heading">Color</div>
						<div className="product-color-options" role="group" aria-label="Elegir color">
							{(colors.length ? colors : [product.color || 'Único']).map((color) => (
								<button
									className={`product-color${selectedColor === color ? ' product-color--selected' : ''}`}
									key={color}
									type="button"
									aria-label={color}
									aria-pressed={selectedColor === color}
									onClick={() => {
										setColorChoice({ productId: product.id, color })
										const colorVariants = variants.filter((variant) => variant.color === color)
										const sizeWithStock = colorVariants.find((variant) => Number(variant.stock) > 0)
										setSizeChoice({
											productId: product.id,
											size: sizeWithStock
												? Number(sizeWithStock.talle)
												: Number(colorVariants[0]?.talle || 40),
										})
										setActionError('')
									}}
								>
									<span style={{ backgroundColor: getColorValue(color) }} />
								</button>
							))}
						</div>
					</div>

					<fieldset className="product-option">
						<legend className="product-option__heading">
							<span>Talle (AR)</span>
						</legend>
						<div className="size-options">
							{sizes.map((size) => (
								<label className="size-option" key={size}>
									<input
										type="radio"
										name="size"
										value={size}
										checked={selectedSize === size}
										disabled={variants.length > 0 && !variants.some(
											(variant) => variant.color === selectedColor
												&& Number(variant.talle) === size
												&& Number(variant.stock) > 0,
										)}
										onChange={() => {
											setSizeChoice({ productId: product.id, size })
											setActionError('')
										}}
									/>
									<span>{size}</span>
								</label>
							))}
						</div>
						<p className="product-stock" aria-live="polite">
							{selectedStock > 0
								? `${selectedStock} unidades disponibles`
								: 'Sin stock para este talle y color'}
						</p>
					</fieldset>

					{!isStaff && (
						<>
							{actionError && <p className="page-error" role="alert">{actionError}</p>}
							{added && <p className="page-success" role="status">Agregada al carrito.</p>}
							<div className="product-info__actions">
								<button
									className="primary-button full-width"
									type="button"
									onClick={handleAddToCart}
									disabled={cartLoading}
								>
									{cartLoading ? 'Agregando...' : 'Agregar al carrito'}
								</button>
							</div>
						</>
					)}
					{isStaff && (
						<p className="muted" role="status">
							Las cuentas de vendedor y administrador no pueden agregar productos al carrito.
						</p>
					)}
					<div className="product-info__policies">
						<span>Envíos coordinados para cada compra.</span>
						<span>Cambios y devoluciones sujetos a disponibilidad.</span>
					</div>
				</section>
			</div>
		</main>
	)
}

export default ProductDetail
