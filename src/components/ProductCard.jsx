import { Link } from 'react-router-dom'

function ProductCard({ product }) {
	const formattedPrice = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(product.precio)

	return (
		<article className="product-card">
			<div className="product-card__image-wrap">
				{product.imagenUrl ? (
					<Link to={`/producto/${product.id}`}>
						<img
							className="product-card__image"
							src={product.imagenUrl}
							alt={product.nombre}
						/>
					</Link>
				) : (
					<Link to={`/producto/${product.id}`}>
						<div className="product-card__image-placeholder" aria-hidden="true">
							<span>{product.marca || 'TPO'}</span>
						</div>
					</Link>
				)}
				<span className="product-card__category">
					<Link to={`/categoria/${product.categoriaId}`}>
						{product.categoriaNombre || product.genero || 'Producto'}
					</Link>
				</span>
			</div>
			<div className="product-card__details">
				<p className="product-card__brand">{product.marca}</p>
			<h2>
				<Link to={`/producto/${product.id}`}>{product.nombre}</Link>
			</h2>
			<p className="product-card__description">{product.descripcion}</p>
				<div className="product-card__footer">
					<strong>{formattedPrice}</strong>
					<span>{product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}</span>
				</div>
				<Link className="product-card__buy" to={`/producto/${product.id}`}>
					Comprar
				</Link>
			</div>
		</article>
	)
}

export default ProductCard
