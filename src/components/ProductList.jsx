import ProductCard from './ProductCard.jsx'
import './ProductList.css'

const products = [
	{
		id: 1,
		nombre: 'Air Runner X1',
		genero: 'Unisex',
		marca: 'Nike',
		descripcion: 'Zapatilla de running liviana, ideal para largas distancias',
		precio: 89999,
		color: 'Negro',
		stock: 25,
		categoriaNombre: 'Running',
	},
	{
		id: 2,
		nombre: 'Street Classic',
		genero: 'Hombre',
		marca: 'Adidas',
		descripcion: 'Zapatilla urbana de estilo retro',
		precio: 74999,
		color: 'Blanco',
		stock: 40,
		categoriaNombre: 'Urbanas',
	},
	{
		id: 3,
		nombre: 'Jump Pro 23',
		genero: 'Hombre',
		marca: 'Puma',
		descripcion: 'Zapatilla de basketball con amortiguación reforzada',
		precio: 109999,
		color: 'Rojo',
		stock: 15,
		categoriaNombre: 'Basketball',
	},
	{
		id: 4,
		nombre: 'City Walk W',
		genero: 'Mujer',
		marca: 'Nike',
		descripcion: 'Zapatilla urbana cómoda para uso diario',
		precio: 69999,
		color: 'Rosa',
		stock: 30,
		categoriaNombre: 'Urbanas',
	},
]

function ProductList() {
	return (
		<main className="catalog">
			<header className="catalog__header">
				<p className="catalog__eyebrow">Tienda</p>
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
