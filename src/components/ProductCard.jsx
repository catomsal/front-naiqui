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
					<img
						className="product-card__image"
						src={product.imagenUrl}
						alt={product.nombre}
					/>
				) : (
					<div className="product-card__image-placeholder" aria-hidden="true">
						<span>{product.marca || 'TPO'}</span>
					</div>
				)}
				<span className="product-card__category">
					{product.categoriaNombre || product.genero || 'Producto'}
				</span>
			</div>
			<div className="product-card__details">
				<p className="product-card__brand">{product.marca}</p>
				<h2>{product.nombre}</h2>
				<p className="product-card__description">{product.descripcion}</p>
				<div className="product-card__footer">
					<strong>{formattedPrice}</strong>
					<span>{product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}</span>
				</div>
			</div>
		</article>
	)
}

export default ProductCard
