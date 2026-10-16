import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function OrderList() {
	const { user } = useAuth()
	const [pedidos, setPedidos] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchPedidos = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/pedidos', {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						// Envía el token JWT guardado en el login (ruta protegida)
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					mode: 'cors',
				})

				if (!response.ok) {
					throw new Error('Error al cargar los pedidos')
				}

				const data = await response.json()
				// Nos quedamos solo con los pedidos del usuario logueado
				setPedidos(data.filter((pedido) => pedido.usuarioId === user.id))
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchPedidos()
		// Dependencia [user.id]: vuelve a buscar si cambia el usuario logueado
	}, [user.id])

	if (loading) return <p className="catalog__message">Cargando pedidos...</p>
	if (error) return <p className="catalog__message">Error: {error}</p>

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Pedidos</p>
				<h1>Mis pedidos</h1>
				<p className="catalog__count">{pedidos.length} pedidos</p>
			</header>
			{pedidos.length === 0 ? (
				<p className="catalog__message">Todavía no tenés pedidos.</p>
			) : (
				<ul>
					{pedidos.map((pedido) => (
						<li key={pedido.id}>
							<Link to={`/pedido/${pedido.id}`}>
								Pedido #{pedido.id} - {pedido.estado} - ${pedido.total}
							</Link>
						</li>
					))}
				</ul>
			)}
		</main>
	)
}

export default OrderList
