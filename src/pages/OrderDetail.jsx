import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { apiRequest } from '../app/api.js'
import { formatPrice } from '../app/format.js'
import { useAuth } from '../context/useAuth.js'

const orderStatuses = [
	{ value: 'PENDIENTE', label: 'Pendiente' },
	{ value: 'CONFIRMADO', label: 'Confirmado' },
	{ value: 'EN_PREPARACION', label: 'En preparación' },
	{ value: 'ENVIADO', label: 'Enviado' },
	{ value: 'ENTREGADO', label: 'Entregado' },
	{ value: 'CANCELADO', label: 'Cancelado' },
]

function OrderDetail() {
	const { id } = useParams()
	const location = useLocation()
	const { user } = useAuth()
	const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())
	const [orderState, setOrderState] = useState({ id: null, pedido: null, error: null })
	const [statusChoice, setStatusChoice] = useState({ orderId: null, status: '' })
	const [statusSaving, setStatusSaving] = useState(false)
	const [statusError, setStatusError] = useState('')
	const [statusSuccess, setStatusSuccess] = useState('')

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
	const selectedStatus = statusChoice.orderId === id ? statusChoice.status : pedido?.estado

	async function handleStatusUpdate(event) {
		event.preventDefault()
		setStatusError('')
		setStatusSuccess('')
		setStatusSaving(true)

		try {
			const updatedOrder = await apiRequest(`/pedidos/${id}/estado`, {
				method: 'PUT',
				body: JSON.stringify({ estado: selectedStatus }),
			})
			setOrderState({ id, pedido: updatedOrder, error: null })
			setStatusChoice({ orderId: id, status: updatedOrder.estado })
			setStatusSuccess('Se actualizó el estado del pedido.')
		} catch (err) {
			setStatusError(err.message || 'No se pudo actualizar el estado del pedido.')
		} finally {
			setStatusSaving(false)
		}
	}

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
				<div className="order-detail-main">
					<section className="order-detail-card" aria-label="Detalle del pedido">
						<h2>Productos</h2>
						<div className="cart-items">
							{pedido.items.map((item) => (
								<article className="cart-item" key={item.id}>
									<div className="cart-item__details">
										<h3>{item.productoNombre}</h3>
										<p>{item.color || 'Color único'} · Talle {item.talle} · Cantidad {item.cantidad}</p>
									</div>
									<strong className="cart-item__subtotal">{formatPrice(item.subtotal)}</strong>
								</article>
							))}
						</div>
					</section>
					<section className="order-detail-card" aria-label="Datos de entrega">
						<h2>Datos de entrega</h2>
						<dl className="order-delivery-details">
							<div><dt>Nombre</dt><dd>{pedido.nombreEntrega || pedido.usuarioNombre || 'No informado'}</dd></div>
							<div><dt>Teléfono</dt><dd>{pedido.telefonoEntrega || 'No informado'}</dd></div>
							<div><dt>Dirección</dt><dd>{pedido.direccionEntrega || 'No informada'}</dd></div>
							<div><dt>Código postal</dt><dd>{pedido.codigoPostalEntrega || 'No informado'}</dd></div>
							<div><dt>Ciudad</dt><dd>{pedido.ciudadEntrega || 'No informada'}</dd></div>
							<div><dt>Provincia</dt><dd>{pedido.provinciaEntrega || 'No informada'}</dd></div>
							<div><dt>Correo del cliente</dt><dd>{pedido.usuarioEmail || 'No informado'}</dd></div>
							<div><dt>Fecha</dt><dd>{new Date(pedido.fecha).toLocaleString('es-AR')}</dd></div>
						</dl>
					</section>
				</div>
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
					{isStaff && pedido.usuarioNombre && (
						<div className="summary-row">
							<span>Cliente</span><span>{pedido.usuarioNombre}</span>
						</div>
					)}
					{isStaff && (
						<form className="order-status-form" onSubmit={handleStatusUpdate}>
							<label htmlFor="order-status">Estado del pedido</label>
							<select
								id="order-status"
								value={selectedStatus}
								onChange={(event) => {
									setStatusChoice({ orderId: id, status: event.target.value })
									setStatusError('')
									setStatusSuccess('')
								}}
								disabled={statusSaving || pedido.estado === 'CANCELADO'}
							>
								{orderStatuses.map((status) => (
									<option key={status.value} value={status.value}>{status.label}</option>
								))}
							</select>
							{statusError && <p className="page-error" role="alert">{statusError}</p>}
							{statusSuccess && <p className="page-success" role="status">{statusSuccess}</p>}
							<button
								className="primary-button full-width"
								type="submit"
								disabled={statusSaving || pedido.estado === 'CANCELADO' || selectedStatus === pedido.estado}
							>
								{statusSaving ? 'Actualizando...' : 'Actualizar estado'}
							</button>
						</form>
					)}
					<Link className="primary-button full-width" to={isStaff ? '/pedidos' : '/'}>
						{isStaff ? 'Volver a pedidos' : 'Seguir comprando'}
					</Link>
					{!isStaff && <Link className="summary-card__continue" to="/pedidos">Ver mis pedidos</Link>}
				</aside>
			</div>
		</main>
	)
}

export default OrderDetail
