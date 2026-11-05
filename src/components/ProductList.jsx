import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import { apiRequest } from '../app/api.js'
import './ProductList.css'

function ProductList() {
	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [availableMaxPrice, setAvailableMaxPrice] = useState(0)
	const [maxPrice, setMaxPrice] = useState(0)
	const [sort, setSort] = useState('relevance')
	const [searchParams] = useSearchParams()
	const searchTerm = (searchParams.get('q') || '').trim().toLocaleLowerCase('es-AR')
	const gender = searchParams.get('genero')
	const offersOnly = searchParams.get('ofertas') === '1'

	useEffect(() => {
		let isCurrent = true
		const fetchCatalog = async () => {
			try {
				const [productData, categoryData] = await Promise.all([
					apiRequest('/productos'),
					apiRequest('/categorias'),
				])
				if (isCurrent) {
					setProducts(productData)
					setCategories(categoryData)
					const highestPrice = Math.max(
						0,
						...productData.map((product) => Number(product.precio) || 0),
					)
					setAvailableMaxPrice(highestPrice)
					setMaxPrice(highestPrice)
				}
			} catch (err) {
				if (isCurrent) setError(err.message)
			} finally {
				if (isCurrent) setLoading(false)
			}
		}

		fetchCatalog()
		return () => {
			isCurrent = false
		}
	}, [])

	const filteredProducts = products
		.filter((product) => selectedCategory === 'all' || String(product.categoriaId) === selectedCategory)
		.filter((product) => !gender || product.genero?.toLocaleLowerCase('es-AR') === gender.toLocaleLowerCase('es-AR'))
		.filter((product) => !searchTerm || `${product.nombre} ${product.marca} ${product.categoriaNombre}`.toLocaleLowerCase('es-AR').includes(searchTerm))
		.filter((product) => !offersOnly || Number(product.precioOriginal) > Number(product.precio))
		.filter((product) => Number(product.precio) <= maxPrice)
		.sort((first, second) => {
			if (sort === 'price-asc') return first.precio - second.precio
			if (sort === 'price-desc') return second.precio - first.precio
			return 0
		})

	if (loading) return <main className="store-page"><p className="muted">Cargando productos...</p></main>
	if (error) return <main className="store-page"><p className="page-error" role="alert">No se pudo cargar el catálogo: {error}</p></main>

	return (
		<main className="store-page">
			<div className="breadcrumbs">
				<Link to="/">Inicio</Link><span>/</span><span>Zapatillas</span>
			</div>
			<header className="page-heading">
				<h1>{offersOnly ? 'Ofertas' : 'Zapatillas'}</h1>
				<p>{filteredProducts.length} productos</p>
			</header>

			<div className="catalog-toolbar">
				{gender && <p className="muted">Para {gender.toLocaleLowerCase('es-AR')}</p>}
				<label>
					Ordenar:
					<select value={sort} onChange={(event) => setSort(event.target.value)}>
						<option value="relevance">Relevancia</option>
						<option value="price-asc">Menor precio</option>
						<option value="price-desc">Mayor precio</option>
					</select>
				</label>
			</div>

			<div className="store-catalog">
				<aside className="catalog-filters" aria-label="Filtros de productos">
					<section className="catalog-filter">
						<h2>Categoría</h2>
						<label>
							<input
								type="checkbox"
								checked={selectedCategory === 'all'}
								onChange={() => setSelectedCategory('all')}
							/>
							Todas
						</label>
						{categories
							.filter((category) => category.nombre?.toLocaleLowerCase('es-AR') !== 'niños')
							.map((category) => (
								<label key={category.id}>
									<input
										type="checkbox"
										checked={selectedCategory === String(category.id)}
										onChange={() =>
											setSelectedCategory(
												selectedCategory === String(category.id)
													? 'all'
													: String(category.id),
											)
										}
									/>
									{category.nombre}
								</label>
							))}
					</section>
					<section className="catalog-filter">
						<h2>Precio máximo</h2>
						<input
							type="range"
							min="0"
							max={Math.max(availableMaxPrice, 1)}
							step="1"
							value={maxPrice}
							onChange={(event) => setMaxPrice(Number(event.target.value))}
							aria-label="Precio máximo"
						/>
						<div className="price-range">
							<span>$ 0</span>
							<span>
								{new Intl.NumberFormat('es-AR', {
									style: 'currency',
									currency: 'ARS',
									maximumFractionDigits: 0,
								}).format(maxPrice)}
							</span>
						</div>
					</section>
				</aside>

				{filteredProducts.length ? (
					<section className="product-grid" aria-label="Lista de productos">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</section>
				) : (
					<div className="empty-state">
						<h2>No encontramos zapatillas</h2>
						<p>Probá con otra búsqueda o ajustá los filtros.</p>
						<button
							type="button"
							className="secondary-button"
							onClick={() => {
								setSelectedCategory('all')
								setMaxPrice(availableMaxPrice)
							}}
						>
							Limpiar filtros
						</button>
					</div>
				)}
			</div>
		</main>
	)
}

export default ProductList
