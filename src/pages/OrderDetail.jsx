import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { apiRequest } from '../app/api.js'
import { formatPrice } from '../app/format.js'

function OrderDetail() {
	const { id } = useParams()
	const location = useLocation()
	const [orderState, setOrderState] = useState({ id: null, pedido: null, error: null })

	useEffect(() => {
		let isCurrent = true
		apiRequest(`/pedidos/${id}`)
			.then((data) => {
				if (isCurrent) setOrderState({ id, pedido: data, error: null })
			})
			.catch((err) => {
				if (isCurrent) setOrderState({ id, pedido: null, error: err.message })
			})
		return () => {
			isCurrent = false
		}
	}, [id])

	const loading = orderState.id !== id
	const pedido = loading ? null : orderState.pedido
	const error = loading ? null : orderState.error

	if (loading) return <main className="store-page"><p className="muted">Cargando pedido...</p></main>
	if (error || !pedido) {
		return <main className="store-page"><p className="page-error" role="alert">{error || 'No encontramos este pedido.'}</p></main>
	}

	return (
		<main className="store-page">
			{location.state?.checkoutSuccess && (
				<p className="page-success" role="status">¡Gracias por tu compra! Recibimos tu pedido.</p>
			)}
			<header className="page-heading">
				<h1>Pedido #{pedido.id}</h1>
				<p>{pedido.estado}</p>
			</header>
			<div className="checkout-layout">
				<section className="cart-items" aria-label="Detalle del pedido">
					{pedido.items.map((item) => (
						<article className="cart-item" key={item.id}>
							<div className="cart-item__details">
								<h2>{item.productoNombre}</h2>
								<p>Talle {item.talle} · Cantidad {item.cantidad}</p>
							</div>
							<strong className="cart-item__subtotal">{formatPrice(item.subtotal)}</strong>
						</article>
					))}
				</section>
				<aside className="summary-card">
					<h2>Resumen</h2>
					<div className="summary-row">
						<span>Estado</span><span>{pedido.estado}</span>
					</div>
					{pedido.metodoPago && (
						<div className="summary-row">
							<span>Pago</span>
							<span>{pedido.metodoPago === 'TARJETA' ? 'Tarjeta' : 'Transferencia o billetera'}</span>
						</div>
					)}
					<div className="summary-total">
						<span>Total</span><span>{formatPrice(pedido.total)}</span>
					</div>
					<Link className="primary-button full-width" to="/">Seguir comprando</Link>
					<Link className="summary-card__continue" to="/pedidos">Ver todos mis pedidos</Link>
				</aside>
			</div>
		</main>
	)
}

export default OrderDetail
