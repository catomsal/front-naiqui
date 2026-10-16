import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function OrderDetail() {
	const { id } = useParams()
	const [pedido, setPedido] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchPedido = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					mode: 'cors',
				})

				if (!response.ok) {
					throw new Error('Pedido no encontrado')
				}

				const data = await response.json()
				setPedido(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchPedido()
		// Dependencia [id]: vuelve a buscar cada vez que cambia el pedido de la URL
	}, [id])

	if (loading) return <p className="catalog__message">Cargando pedido...</p>

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Pedido</p>
				<h1>Pedido #{id}</h1>
			</header>
			{error ? (
				<p className="catalog__message">Error: {error}</p>
			) : (
				<>
					<p>Estado: {pedido.estado}</p>
					<ul>
						{pedido.items.map((item) => (
							<li key={item.id}>
								{item.productoNombre} x{item.cantidad} - ${item.subtotal}
							</li>
						))}
					</ul>
					<p>Total: ${pedido.total}</p>
				</>
			)}
			<Link to="/pedidos">Volver a pedidos</Link>
		</main>
	)
}

export default OrderDetail
