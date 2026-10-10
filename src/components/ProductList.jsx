import ProductCard from './ProductCard.jsx'
import { products } from '../data/products.js'
import './ProductList.css'

function ProductList() {
	return (
		<main className="catalog">
			<header className="catalog__header">
				<h1>Catálogo de productos</h1>
				<p className="catalog__count">{products.length} productos</p>
			</header>

			<section className="product-grid" aria-label="Lista de productos">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</section>
		</main>
	)
}

export default ProductList
