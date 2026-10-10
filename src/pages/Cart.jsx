import { useCart } from '../context/useCart.js'

function Cart() {
	const { items, removeItem, clear } = useCart()

	if (items.length === 0) {
		return (
			<main className="catalog">
				<header className="catalog__header">
					<p className="catalog__eyebrow">Carrito</p>
					<h1>Mi carrito</h1>
				</header>
				<p className="catalog__message">Tu carrito está vacío.</p>
			</main>
		)
	}

	const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Carrito</p>
				<h1>Mi carrito</h1>
				<p className="catalog__count">{items.length} productos</p>
			</header>
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
		</main>
	)
}

export default Cart
