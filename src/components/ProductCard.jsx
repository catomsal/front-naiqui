import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton.jsx'
import ProductImage from './ProductImage.jsx'

function ProductCard({ product }) {
	const hasDiscount = Number(product.precioOriginal) > Number(product.precio)
	const discount = hasDiscount
		? Math.round((1 - Number(product.precio) / Number(product.precioOriginal)) * 100)
		: 0
	const formattedPrice = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(product.precio)
	const categoryLabel = product.categoriaNombre || 'Zapatillas'
	const genderLabel = product.genero || 'Unisex'
	const categoryText =
		categoryLabel.toLocaleLowerCase('es-AR') === genderLabel.toLocaleLowerCase('es-AR')
			? categoryLabel
			: `${categoryLabel} · ${genderLabel}`

	return (
		<article className="product-card">
			<FavoriteButton product={product} />
			<Link className="product-card__image-wrap" to={`/producto/${product.id}`}>
				<ProductImage
					className={product.imagenUrl ? 'product-card__image' : 'product-card__placeholder'}
					src={product.imagenUrl}
					alt={product.nombre}
				/>
				{hasDiscount && <span className="product-card__discount">{discount}% OFF</span>}
				<span className="product-card__category">{categoryText}</span>
			</Link>
			<div className="product-card__details">
				<p className="product-card__brand">{product.marca}</p>
				<h2>
					<Link to={`/producto/${product.id}`}>{product.nombre}</Link>
				</h2>
				<p className="product-card__description">{product.descripcion}</p>
				<p className="product-card__creator">Publicado por {product.creadorNombre || 'Equipo Naiqui'}</p>
				<div className="product-card__price-group">
					{hasDiscount && (
						<del className="product-card__old-price">
							{new Intl.NumberFormat('es-AR', {
								style: 'currency',
								currency: 'ARS',
								maximumFractionDigits: 0,
							}).format(product.precioOriginal)}
						</del>
					)}
					<strong className="product-card__price">{formattedPrice}</strong>
				</div>
			</div>
		</article>
	)
}

export default ProductCard
