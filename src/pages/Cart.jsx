import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductImage from '../components/ProductImage.jsx'
import { formatPrice } from '../app/format.js'
import {
	addToCart,
	fetchCartItems,
	removeCartItem,
	updateCartItem,
} from '../store/slices/cartSlice.js'
import { useAuth } from '../context/useAuth.js'

function Cart() {
	const dispatch = useDispatch()
	const { user } = useAuth()
	const { items, loading, error, initialized } = useSelector((state) => state.cart)

	useEffect(() => {
		if (user?.id && !initialized) dispatch(fetchCartItems(user.id))
	}, [dispatch, initialized, user?.id])

	const subtotal = items.reduce(
		(total, item) =>
			total + (Number(item.subtotal) || Number(item.precioUnitario) * item.cantidad),
		0,
	)

	function addOne(item) {
		dispatch(
			addToCart({
				userId: user.id,
				productoId: item.productoId,
				talle: item.talle,
				color: item.color,
				cantidad: 1,
			}),
		)
	}

	function removeOne(item) {
		if (item.cantidad <= 1) return
		dispatch(
			updateCartItem({
				userId: user.id,
				itemId: item.id,
				cantidad: item.cantidad - 1,
			}),
		)
	}

	if (loading && !initialized) {
		return <main className="store-page"><p className="muted">Cargando tu carrito...</p></main>
	}

	if (error && items.length === 0) {
		return (
			<main className="store-page">
				<p className="page-error" role="alert">{error}</p>
				<button className="secondary-button" type="button" onClick={() => dispatch(fetchCartItems(user.id))}>
					Reintentar
				</button>
			</main>
		)
	}

	return (
		<main className="store-page">
			<header className="page-heading">
				<h1>Mi carrito</h1>
				<p>{items.reduce((count, item) => count + item.cantidad, 0)} productos</p>
			</header>

			{error && (
				<div className="page-error" role="alert">
					<p>{error}</p>
					<button className="text-link" type="button" onClick={() => dispatch(fetchCartItems(user.id))}>
						Reintentar
					</button>
				</div>
			)}

			{items.length === 0 && !loading ? (
				<div className="empty-state">
					<h2>Tu carrito está vacío</h2>
					<p>Encontrá tu próximo par favorito en el catálogo.</p>
					<Link className="primary-button" to="/">Seguir comprando</Link>
				</div>
			) : (
				<div className="cart-layout">
					<section className="cart-items" aria-label="Productos en el carrito">
						{items.map((item) => (
							<article className="cart-item" key={item.id}>
								<Link className="cart-item__image" to={`/producto/${item.productoId}`} aria-label={item.productoNombre}>
									<ProductImage
										className="cart-item__product-image"
										src={item.imagenUrl}
										alt={item.productoNombre}
									/>
								</Link>
								<div className="cart-item__details">
									<h2>
										<Link to={`/producto/${item.productoId}`}>{item.productoNombre}</Link>
									</h2>
									<p>{item.color || 'Color único'} · Talle {item.talle}</p>
									<button
										className="cart-item__remove"
										type="button"
										onClick={() => dispatch(removeCartItem({ userId: user.id, itemId: item.id }))}
										disabled={loading}
									>
										Quitar
									</button>
								</div>
								<div className="quantity-control" aria-label={`Cantidad: ${item.cantidad}`}>
									<button
										type="button"
										aria-label="Reducir cantidad"
										onClick={() => removeOne(item)}
										disabled={loading || item.cantidad <= 1}
									>
										−
									</button>
									<span>{item.cantidad}</span>
									<button
										type="button"
										aria-label="Aumentar cantidad"
										onClick={() => addOne(item)}
										disabled={loading}
									>
										+
									</button>
								</div>
								<strong className="cart-item__subtotal">
									{formatPrice(Number(item.subtotal) || Number(item.precioUnitario) * item.cantidad)}
								</strong>
							</article>
						))}
					</section>

					<aside className="summary-card">
						<h2>Resumen</h2>
						<div className="summary-row">
							<span>Subtotal</span>
							<span>{formatPrice(subtotal)}</span>
						</div>
						<div className="summary-row">
							<span>Envío</span>
							<span>A coordinar</span>
						</div>
						<div className="summary-total">
							<span>Total</span>
							<span>{formatPrice(subtotal)}</span>
						</div>
						<Link className="primary-button full-width" to="/checkout">
							Ir a pagar
						</Link>
						<Link className="summary-card__continue" to="/">Seguir comprando</Link>
					</aside>
				</div>
			)}
		</main>
	)
}

export default Cart
