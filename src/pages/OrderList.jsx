import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { apiRequest } from '../app/api.js'
import { formatPrice } from '../app/format.js'

function OrderList() {
	const { user } = useAuth()
	const canViewAllOrders = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())
	const [pedidos, setPedidos] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const pedidosOrdenados = [...pedidos].sort((a, b) => {
		const fechaA = Date.parse(a.fecha) || 0
		const fechaB = Date.parse(b.fecha) || 0
		return fechaB - fechaA
	})

	useEffect(() => {
		let isCurrent = true
		apiRequest(canViewAllOrders ? '/pedidos' : `/usuarios/${user.id}/pedidos`)
			.then((data) => {
				if (isCurrent) setPedidos(data)
			})
			.catch((err) => {
				if (isCurrent) setError(err.message)
			})
			.finally(() => {
				if (isCurrent) setLoading(false)
			})
		return () => {
			isCurrent = false
		}
	}, [canViewAllOrders, user.id])

	if (loading) return <main className="store-page"><p className="muted">Cargando pedidos...</p></main>
	if (error) return <main className="store-page"><p className="page-error" role="alert">{error}</p></main>

	return (
		<main className="store-page">
			<header className="page-heading">
				<h1>{canViewAllOrders ? 'Pedidos' : 'Mis pedidos'}</h1>
				<p>{pedidos.length} pedidos</p>
			</header>
			{pedidos.length === 0 ? (
				<div className="empty-state">
					<h2>{canViewAllOrders ? 'Todavía no hay pedidos' : 'Todavía no tenés pedidos'}</h2>
					<p>
						{canViewAllOrders
							? 'Los pedidos de los clientes aparecerán en esta sección.'
							: 'Cuando completes una compra, vas a poder seguirla desde acá.'}
					</p>
					{!canViewAllOrders && <Link className="primary-button" to="/">Ver catálogo</Link>}
				</div>
			) : (
				<div className="order-list">
					{pedidosOrdenados.map((pedido) => (
						<article className="summary-card" key={pedido.id}>
							<div className="order-list__row">
								<strong>Pedido #{pedido.id}</strong>
								<span>{pedido.estado}</span>
							</div>
							<p className="order-list__date">
								{pedido.fecha
									? new Date(pedido.fecha).toLocaleString('es-AR', {
										dateStyle: 'medium',
										timeStyle: 'short',
									})
									: 'Fecha no disponible'}
							</p>
							<div className="order-list__row">
								<span>{pedido.items.length} productos</span>
								<strong>{formatPrice(pedido.total)}</strong>
							</div>
							{canViewAllOrders && (
								<p className="order-list__customer">
									Cliente: {pedido.usuarioNombre || `Usuario #${pedido.usuarioId}`}
								</p>
							)}
							<Link className="text-link" to={`/pedido/${pedido.id}`}>Ver pedido</Link>
						</article>
					))}
				</div>
			)}
		</main>
	)
}

export default OrderList
