import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart.js'

function Cart() {
	const { items, removeItem, clear } = useCart()

	const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Carrito</p>
				<h1>Mi carrito</h1>
				{/* Renderizado condicional con &&: solo si hay productos */}
				{items.length > 0 && (
					<p className="catalog__count">{items.length} productos</p>
				)}
			</header>

			{/* Renderizado condicional con operador ternario */}
			{items.length === 0 ? (
				<p className="catalog__message">Tu carrito está vacío.</p>
			) : (
				<>
					<ul>
						{items.map((item) => (
							<li key={item.id}>
								{item.nombre} x{item.cantidad} - ${item.precio * item.cantidad}
								<button type="button" onClick={() => removeItem(item.id)}>
									Quitar
								</button>
							</li>
						))}
					</ul>
					<p>Total: ${total}</p>
					<button type="button" onClick={clear}>
						Vaciar carrito
					</button>
				</>
			)}

			<Link to="/">Seguir comprando</Link>
		</main>
	)
}

export default Cart
