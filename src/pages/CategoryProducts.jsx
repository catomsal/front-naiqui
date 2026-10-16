import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'

function CategoryProducts() {
	const { id } = useParams()
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchProductsByCategory = async () => {
			// Antes de cada nueva búsqueda, reiniciamos los estados
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(
					`http://localhost:8080/api/productos/categoria/${id}`,
					{
						method: 'GET',
						headers: { Accept: 'application/json' },
						mode: 'cors',
					},
				)

				if (!response.ok) {
					throw new Error('Error al cargar los productos de la categoría')
				}

				const data = await response.json()
				setProducts(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchProductsByCategory()
		// Dependencia [id]: se vuelve a ejecutar cada vez que cambia la categoría
	}, [id])

	if (loading) return <p className="catalog__message">Cargando productos...</p>
	if (error) return <p className="catalog__message">Error: {error}</p>

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Categoría</p>
				{/* Operador ||: valor alternativo si la categoría no tiene productos */}
				<h1>{products[0]?.categoriaNombre || 'Categoría'}</h1>
				<p className="catalog__count">{products.length} productos</p>
			</header>

			{products.length === 0 ? (
				<p className="catalog__message">No hay productos en esta categoría.</p>
			) : (
				<section className="product-grid" aria-label="Productos de la categoría">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</section>
			)}

			<Link to="/">Volver al catálogo</Link>
		</main>
	)
}

export default CategoryProducts
