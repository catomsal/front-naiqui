import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

function CategoryProducts() {
	const { nombre } = useParams()
	const filtered = products.filter(
		(p) => p.categoriaNombre === decodeURIComponent(nombre),
	)

	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Categoría</p>
				<h1>{decodeURIComponent(nombre)}</h1>
				<p className="catalog__count">{filtered.length} productos</p>
			</header>

			{filtered.length === 0 ? (
				<p className="catalog__message">No hay productos en esta categoría.</p>
			) : (
				<section className="product-grid" aria-label="Productos de la categoría">
					{filtered.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</section>
			)}

			<Link to="/">Volver al catálogo</Link>
		</main>
	)
}

export default CategoryProducts
