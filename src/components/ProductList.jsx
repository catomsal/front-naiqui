import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import './ProductList.css'

function ProductList() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/productos', {
					method: 'GET',
					headers: { Accept: 'application/json' },
					// Petición CORS: el front (5173) y el back (8080) están en distintos puertos
					mode: 'cors',
				})

				if (!response.ok) {
					throw new Error('Error al cargar los productos')
				}

				const data = await response.json()
				setProducts(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
		// Array de dependencias vacío: se ejecuta una sola vez al montar el componente
	}, [])

	// --- Manejo de estados de carga y error ---
	if (loading) return <p className="catalog__message">Cargando productos...</p>
	if (error) return <p className="catalog__message">Error: {error}</p>

	return (
		<main className="catalog">
			<header className="catalog__header">
				<h1>Catálogo de productos</h1>
				<p className="catalog__count">{products.length} productos</p>
			</header>

			{products.length === 0 ? (
				<p className="catalog__message">No hay productos disponibles.</p>
			) : (
				<section className="product-grid" aria-label="Lista de productos">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</section>
			)}
		</main>
	)
}

export default ProductList
