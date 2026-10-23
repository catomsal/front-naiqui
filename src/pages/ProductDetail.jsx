import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/useCart.js'
import FavoriteButton from '../components/FavoriteButton.jsx'

function ProductDetail() {
	const { id } = useParams()
	const { addItem } = useCart()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
					method: 'GET',
					headers: { Accept: 'application/json' },
					mode: 'cors',
				})

				if (!response.ok) {
					throw new Error('Producto no encontrado')
				}

				const data = await response.json()
				setProduct(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchProduct()
		// Dependencia [id]: vuelve a buscar el producto cada vez que cambia el id de la URL
	}, [id])

	if (loading) return <p className="catalog__message">Cargando producto...</p>

	if (error || !product) {
		return (
			<main className="catalog">
				<p className="catalog__message">{error || 'Producto no encontrado.'}</p>
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
				Género: {product.genero || '-'} · Color: {product.color || '-'}
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
			<FavoriteButton product={product} />
			<Link to="/">Volver al catálogo</Link>
		</main>
	)
}

export default ProductDetail
