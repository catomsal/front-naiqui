import { Link } from 'react-router-dom'

const pedidos = [
	{ id: 1, estado: 'Pendiente', total: 89999 },
	{ id: 2, estado: 'Entregado', total: 154998 },
]

function OrderList() {
	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Pedidos</p>
				<h1>Mis pedidos</h1>
				<p className="catalog__count">{pedidos.length} pedidos</p>
			</header>
			<ul>
				{pedidos.map((pedido) => (
					<li key={pedido.id}>
						<Link to={`/pedido/${pedido.id}`}>
							Pedido #{pedido.id} - {pedido.estado} - ${pedido.total}
						</Link>
					</li>
				))}
			</ul>
		</main>
	)
}

export default OrderList
