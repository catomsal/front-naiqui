import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/useCart.js'
import { products } from '../data/products.js'

function ProductDetail() {
	const { id } = useParams()
	const { addItem } = useCart()
	const product = products.find((p) => p.id === Number(id))

	if (!product) {
		return (
			<main className="catalog">
				<p className="catalog__message">Producto no encontrado.</p>
				<Link to="/">Volver al catálogo</Link>
			</main>
		)
	}

	const formattedPrice = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(product.precio)

	return (
		<main className="catalog">
			<p className="catalog__eyebrow">{product.categoriaNombre}</p>
			<h1>{product.nombre}</h1>
			<p className="product-card__brand">{product.marca}</p>
			<p>{product.descripcion}</p>
			<p>
				Género: {product.genero} · Color: {product.color}
			</p>
			<p>
				<strong>{formattedPrice}</strong>{' '}
				<span>{product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}</span>
			</p>
			{product.stock > 0 && (
				<button type="button" onClick={() => addItem(product)}>
					Añadir al carrito
				</button>
			)}
			<Link to="/">Volver al catálogo</Link>
		</main>
	)
}

export default ProductDetail
