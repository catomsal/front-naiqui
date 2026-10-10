import { Link, useParams } from 'react-router-dom'

function OrderDetail() {
	const { id } = useParams()

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Pedido</p>
				<h1>Pedido #{id}</h1>
			</header>
			<p className="catalog__message">Detalle del pedido.</p>
			<Link to="/pedidos">Volver a pedidos</Link>
		</main>
	)
}

export default OrderDetail
