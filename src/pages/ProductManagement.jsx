import { useEffect, useState } from 'react'
import { apiRequest } from '../app/api.js'

const sizes = [38, 39, 40, 41, 42, 43]

function createDraft(product) {
	const hasDiscount = Number(product.precioOriginal) > Number(product.precio)
	const discount = hasDiscount
		? Math.round((1 - Number(product.precio) / Number(product.precioOriginal)) * 100)
		: 0
	const variantsByColor = new Map()
	for (const variant of product.variantes || []) {
		if (!variantsByColor.has(variant.color)) {
			variantsByColor.set(variant.color, Object.fromEntries(sizes.map((size) => [size, '0'])))
		}
		variantsByColor.get(variant.color)[variant.talle] = String(variant.stock)
	}

	if (!variantsByColor.size) {
		const color = product.color || 'Negro'
		const stockPerSize = Math.floor(Number(product.stock || 0) / sizes.length)
		let remainingStock = Number(product.stock || 0) % sizes.length
		variantsByColor.set(color, Object.fromEntries(sizes.map((size) => {
			const stock = stockPerSize + (remainingStock-- > 0 ? 1 : 0)
			return [size, String(stock)]
		})))
	}

	return {
		nombre: product.nombre || '',
		marca: product.marca || '',
		genero: product.genero || '',
		descripcion: product.descripcion || '',
		precioRegular: String(product.precioOriginal ?? product.precio ?? ''),
		descuento: String(discount),
		imagenUrl: product.imagenUrl || '',
		categoriaId: String(product.categoriaId || ''),
		variantes: [...variantsByColor].map(([color, stockPorTalle]) => ({ color, stockPorTalle })),
		nuevoColor: '',
	}
}

function createEmptyProduct() {
	return {
		nombre: '',
		marca: '',
		genero: 'Unisex',
		descripcion: '',
		precioRegular: '',
		descuento: '0',
		variantes: [{ color: 'Negro', stockPorTalle: Object.fromEntries(sizes.map((size) => [size, '0'])) }],
		imagenUrl: '',
		categoriaId: '',
	}
}

function ProductManagement() {
	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [drafts, setDrafts] = useState({})
	const [newProduct, setNewProduct] = useState(null)
	const [newColor, setNewColor] = useState('')
	const [loading, setLoading] = useState(true)
	const [savingProductId, setSavingProductId] = useState(null)
	const [creatingProduct, setCreatingProduct] = useState(false)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')

	useEffect(() => {
		let isCurrent = true
		Promise.all([apiRequest('/productos'), apiRequest('/categorias')])
			.then(([productData, categoryData]) => {
				if (!isCurrent) return
				setProducts(productData)
				setCategories(categoryData)
			})
			.catch((err) => {
				if (isCurrent) setError(err.message || 'No se pudieron cargar los productos.')
			})
			.finally(() => {
				if (isCurrent) setLoading(false)
			})

		return () => {
			isCurrent = false
		}
	}, [])

	function startEditing(product) {
		setDrafts((current) => ({ ...current, [product.id]: createDraft(product) }))
		setNewColor('')
		setError('')
		setNotice('')
	}

	function updateDraft(productId, field, value) {
		setDrafts((current) => ({
			...current,
			[productId]: { ...current[productId], [field]: value },
		}))
	}

	function cancelEditing(productId) {
		setDrafts((current) => {
			const next = { ...current }
			delete next[productId]
			return next
		})
	}

	function updateNewProduct(field, value) {
		setNewProduct((current) => ({ ...current, [field]: value }))
	}

	function updateVariantStock(colorIndex, size, value, productId = null) {
		const updateVariants = (current) => ({
			...current,
			variantes: current.variantes.map((variant, index) => (
				index === colorIndex
					? { ...variant, stockPorTalle: { ...variant.stockPorTalle, [size]: value } }
					: variant
			)),
		})
		if (productId !== null) {
			setDrafts((current) => ({
				...current,
				[productId]: updateVariants(current[productId]),
			}))
			return
		}
		setNewProduct((current) => ({
			...updateVariants(current),
		}))
	}

	function addVariantColor(productId = null) {
		const color = (productId === null ? newColor : drafts[productId]?.nuevoColor || '').trim()
		const currentVariants = productId === null ? newProduct.variantes : drafts[productId]?.variantes || []
		if (!color) {
			setError('Ingresá un color para agregarlo.')
			return
		}
		if (currentVariants.some((variant) => variant.color.toLocaleLowerCase('es-AR') === color.toLocaleLowerCase('es-AR'))) {
			setError('Ese color ya está agregado.')
			return
		}
		const updateVariants = (current) => ({
			...current,
			variantes: [
				...current.variantes,
				{ color, stockPorTalle: Object.fromEntries(sizes.map((size) => [size, '0'])) },
			],
			nuevoColor: '',
		})
		if (productId !== null) {
			setDrafts((current) => ({ ...current, [productId]: updateVariants(current[productId]) }))
		} else {
			setNewProduct((current) => updateVariants(current))
			setNewColor('')
		}
		setError('')
	}

	function removeVariantColor(colorIndex, productId = null) {
		const updateVariants = (current) => ({
			...current,
			variantes: current.variantes.filter((_, index) => index !== colorIndex),
		})
		if (productId !== null) {
			setDrafts((current) => ({ ...current, [productId]: updateVariants(current[productId]) }))
		} else {
			setNewProduct((current) => updateVariants(current))
		}
	}

	async function createProduct(event) {
		event.preventDefault()
		const regularPrice = Number(newProduct.precioRegular)
		const discount = Number(newProduct.descuento)

		if (!Number.isFinite(regularPrice) || regularPrice <= 0) {
			setError('El precio regular debe ser mayor a cero.')
			return
		}
		if (!Number.isInteger(discount) || discount < 0 || discount > 90) {
			setError('El descuento debe ser un porcentaje entero entre 0 y 90.')
			return
		}
		if (!newProduct.variantes.length) {
			setError('Agregá al menos un color y sus variantes de talle.')
			return
		}
		if (!newProduct.categoriaId) {
			setError('Seleccioná una categoría para el producto.')
			return
		}
		const variantes = newProduct.variantes.flatMap((variant) => sizes.map((talle) => {
			const stock = Number(variant.stockPorTalle[talle])
			return { color: variant.color, talle, stock }
		}))
		if (variantes.some((variant) => !Number.isInteger(variant.stock) || variant.stock < 0)) {
			setError('El stock de cada variante debe ser un número entero igual o mayor a cero.')
			return
		}

		const payload = {
			nombre: newProduct.nombre.trim(),
			marca: newProduct.marca.trim(),
			genero: newProduct.genero.trim(),
			descripcion: newProduct.descripcion.trim(),
			precio: discount ? Math.round(regularPrice * (100 - discount)) / 100 : regularPrice,
			precioOriginal: discount ? regularPrice : null,
			stock: variantes.reduce((total, variant) => total + variant.stock, 0),
			color: newProduct.variantes[0].color,
			variantes,
			imagenUrl: newProduct.imagenUrl.trim(),
			categoriaId: Number(newProduct.categoriaId),
		}

		if (!payload.nombre) {
			setError('El nombre del producto es obligatorio.')
			return
		}

		setCreatingProduct(true)
		setError('')
		setNotice('')
		try {
			const createdProduct = await apiRequest('/productos', {
				method: 'POST',
				body: JSON.stringify(payload),
			})
			setProducts((current) => [createdProduct, ...current])
			setNewProduct(null)
			setNotice(`Se creó el producto "${createdProduct.nombre}".`)
		} catch (err) {
			setError(err.message || 'No se pudo crear el producto.')
		} finally {
			setCreatingProduct(false)
		}
	}

	async function saveProduct(event, product) {
		event.preventDefault()
		const draft = drafts[product.id]
		const regularPrice = Number(draft.precioRegular)
		const discount = Number(draft.descuento)

		if (!Number.isFinite(regularPrice) || regularPrice <= 0) {
			setError('El precio regular debe ser mayor a cero.')
			return
		}
		if (!Number.isInteger(discount) || discount < 0 || discount > 90) {
			setError('El descuento debe ser un porcentaje entero entre 0 y 90.')
			return
		}
		if (!draft.categoriaId) {
			setError('Seleccioná una categoría para el producto.')
			return
		}
		if (!draft.variantes.length) {
			setError('El producto debe conservar al menos un color.')
			return
		}
		const variantes = draft.variantes.flatMap((variant) => sizes.map((talle) => ({
			color: variant.color.trim(),
			talle,
			stock: Number(variant.stockPorTalle[talle]),
		})))
		if (
			draft.variantes.some((variant) => !variant.color.trim()) ||
			new Set(draft.variantes.map((variant) => variant.color.trim().toLocaleLowerCase('es-AR'))).size !== draft.variantes.length ||
			variantes.some((variant) => !Number.isInteger(variant.stock) || variant.stock < 0)
		) {
			setError('Revisá los colores y asegurate de que el stock de cada variante sea un entero igual o mayor a cero.')
			return
		}

		const salePrice = Math.round(regularPrice * (100 - discount)) / 100
		const payload = {
			nombre: draft.nombre.trim(),
			marca: draft.marca.trim(),
			genero: draft.genero.trim(),
			descripcion: draft.descripcion.trim(),
			precio: discount ? salePrice : regularPrice,
			precioOriginal: discount ? regularPrice : null,
			color: draft.variantes[0].color.trim(),
			stock: variantes.reduce((total, variant) => total + variant.stock, 0),
			variantes,
			imagenUrl: draft.imagenUrl.trim(),
			categoriaId: Number(draft.categoriaId),
		}

		if (!payload.nombre) {
			setError('El nombre del producto es obligatorio.')
			return
		}

		setSavingProductId(product.id)
		setError('')
		setNotice('')
		try {
			const updatedProduct = await apiRequest(`/productos/${product.id}`, {
				method: 'PUT',
				body: JSON.stringify(payload),
			})
			setProducts((current) => current.map((item) => (
				item.id === updatedProduct.id ? updatedProduct : item
			)))
			cancelEditing(product.id)
			setNotice(`Se guardaron los cambios de "${updatedProduct.nombre}".`)
		} catch (err) {
			setError(err.message || 'No se pudo guardar el producto.')
		} finally {
			setSavingProductId(null)
		}
	}

	if (loading) return <main className="store-page"><p className="muted">Cargando productos...</p></main>
	if (error && !products.length) {
		return <main className="store-page"><p className="page-error" role="alert">{error}</p></main>
	}

	return (
		<main className="store-page">
			<header className="product-management-heading">
				<div className="page-heading">
					<h1>Administrar productos</h1>
					<p>{products.length} productos</p>
				</div>
				<button
					className="primary-button"
					type="button"
					aria-expanded={Boolean(newProduct)}
					onClick={() => {
						setNewProduct((current) => current ? null : createEmptyProduct())
						setNewColor('')
						setError('')
						setNotice('')
					}}
				>
					{newProduct ? 'Cancelar' : '＋ Crear producto'}
				</button>
			</header>
			<p className="muted">Editá los datos del catálogo y aplicá o quitá descuentos.</p>
			{error && <p className="page-error" role="alert">{error}</p>}
			{notice && <p className="page-success" role="status">{notice}</p>}
			{newProduct && (
				<section className="product-create-card" aria-label="Crear producto">
					<h2>Nuevo producto</h2>
					<form className="product-editor" onSubmit={createProduct}>
						<label>
							Nombre
							<input
								required
								maxLength="150"
								value={newProduct.nombre}
								onChange={(event) => updateNewProduct('nombre', event.target.value)}
							/>
						</label>
						<label>
							Marca
							<input
								value={newProduct.marca}
								onChange={(event) => updateNewProduct('marca', event.target.value)}
							/>
						</label>
						<label>
							Género
							<input
								value={newProduct.genero}
								onChange={(event) => updateNewProduct('genero', event.target.value)}
							/>
						</label>
						<label>
							Categoría
							<select
								required
								value={newProduct.categoriaId}
								onChange={(event) => updateNewProduct('categoriaId', event.target.value)}
							>
								<option value="" disabled>Seleccioná una categoría</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>{category.nombre}</option>
								))}
							</select>
						</label>
						<label>
							Precio regular
							<input
								type="number"
								min="0.01"
								step="0.01"
								required
								value={newProduct.precioRegular}
								onChange={(event) => updateNewProduct('precioRegular', event.target.value)}
							/>
						</label>
						<label>
							Descuento (%)
							<input
								type="number"
								min="0"
								max="90"
								step="1"
								value={newProduct.descuento}
								onChange={(event) => updateNewProduct('descuento', event.target.value)}
							/>
							<span className="product-editor__hint">Opcional; poné 0 si no tiene descuento.</span>
						</label>
						<fieldset className="product-editor__variants">
							<legend>Colores y stock por talle</legend>
							{newProduct.variantes.map((variant, colorIndex) => (
								<div className="product-editor__variant-color" key={variant.color}>
									<div className="product-editor__variant-heading">
										<strong>{variant.color}</strong>
										{colorIndex > 0 && (
											<button
												className="text-link"
												type="button"
												onClick={() => removeVariantColor(colorIndex)}
											>
												Quitar color
											</button>
										)}
									</div>
									<div className="product-editor__variant-sizes">
										{sizes.map((size) => (
											<label key={size}>
												Talle {size}
												<input
													type="number"
													min="0"
													step="1"
													required
													value={variant.stockPorTalle[size]}
													onChange={(event) => updateVariantStock(colorIndex, size, event.target.value)}
												/>
											</label>
										))}
									</div>
								</div>
							))}
							<div className="product-editor__add-color">
								<label>
									Agregar otro color
									<input value={newColor} onChange={(event) => setNewColor(event.target.value)} />
								</label>
								<button className="secondary-button" type="button" onClick={addVariantColor}>
									Agregar color
								</button>
							</div>
						</fieldset>
						<label className="product-editor__wide">
							URL de imagen
							<input
								type="url"
								value={newProduct.imagenUrl}
								onChange={(event) => updateNewProduct('imagenUrl', event.target.value)}
							/>
						</label>
						<label className="product-editor__wide">
							Descripción
							<textarea
								rows="3"
								value={newProduct.descripcion}
								onChange={(event) => updateNewProduct('descripcion', event.target.value)}
							/>
						</label>
						<div className="product-editor__actions">
							<button className="primary-button" type="submit" disabled={creatingProduct}>
								{creatingProduct ? 'Creando...' : 'Crear producto'}
							</button>
							<button
								className="secondary-button"
								type="button"
								disabled={creatingProduct}
								onClick={() => setNewProduct(null)}
							>
								Cancelar
							</button>
						</div>
					</form>
				</section>
			)}
			<section className="product-management-list" aria-label="Productos">
				{products.map((product) => {
					const draft = drafts[product.id]
					const hasDiscount = Number(product.precioOriginal) > Number(product.precio)
					return (
						<article className="product-management-card" key={product.id}>
							<div className="product-management-card__summary">
								{product.imagenUrl ? (
									<img src={product.imagenUrl} alt="" />
								) : (
									<div className="product-management-card__placeholder" aria-hidden="true">Sin imagen</div>
								)}
								<div>
									<strong>{product.nombre}</strong>
									<span>{product.marca} · {product.categoriaNombre}</span>
									<span>
										{hasDiscount ? (
											<>
												<del>${Number(product.precioOriginal).toLocaleString('es-AR')}</del>
												{' '}${Number(product.precio).toLocaleString('es-AR')} · En oferta
											</>
										) : (
											<>${Number(product.precio).toLocaleString('es-AR')}</>
										)}
									</span>
								</div>
								<button
									className="secondary-button"
									type="button"
									aria-expanded={Boolean(draft)}
									onClick={() => draft ? cancelEditing(product.id) : startEditing(product)}
								>
									{draft ? 'Cerrar' : 'Editar'}
								</button>
							</div>
							{draft && (
								<form className="product-editor" onSubmit={(event) => saveProduct(event, product)}>
									<label>
										Nombre
										<input
											required
											maxLength="150"
											value={draft.nombre}
											onChange={(event) => updateDraft(product.id, 'nombre', event.target.value)}
										/>
									</label>
									<label>
										Marca
										<input
											value={draft.marca}
											onChange={(event) => updateDraft(product.id, 'marca', event.target.value)}
										/>
									</label>
									<label>
										Género
										<input
											value={draft.genero}
											onChange={(event) => updateDraft(product.id, 'genero', event.target.value)}
										/>
									</label>
									<label>
										Categoría
										<select
											required
											value={draft.categoriaId}
											onChange={(event) => updateDraft(product.id, 'categoriaId', event.target.value)}
										>
											<option value="" disabled>Seleccioná una categoría</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>{category.nombre}</option>
											))}
										</select>
									</label>
									<label>
										Precio regular
										<input
											type="number"
											min="0.01"
											step="0.01"
											required
											value={draft.precioRegular}
											onChange={(event) => updateDraft(product.id, 'precioRegular', event.target.value)}
										/>
									</label>
									<label>
										Descuento (%)
										<input
											type="number"
											min="0"
											max="90"
											step="1"
											value={draft.descuento}
											onChange={(event) => updateDraft(product.id, 'descuento', event.target.value)}
										/>
										<span className="product-editor__hint">Poné 0 para quitar el descuento.</span>
									</label>
									<label className="product-editor__wide">
										URL de imagen
										<input
											type="url"
											value={draft.imagenUrl}
											onChange={(event) => updateDraft(product.id, 'imagenUrl', event.target.value)}
										/>
									</label>
									<label className="product-editor__wide">
										Descripción
										<textarea
											rows="3"
											value={draft.descripcion}
											onChange={(event) => updateDraft(product.id, 'descripcion', event.target.value)}
										/>
									</label>
									<fieldset className="product-editor__variants">
										<legend>Colores y stock por talle</legend>
										{draft.variantes.map((variant, colorIndex) => (
											<div className="product-editor__variant-color" key={variant.color}>
												<div className="product-editor__variant-heading">
													<strong>{variant.color}</strong>
													{colorIndex > 0 && (
														<button
															className="text-link"
															type="button"
															disabled={savingProductId === product.id}
															onClick={() => removeVariantColor(colorIndex, product.id)}
														>
															Quitar color
														</button>
													)}
												</div>
												<div className="product-editor__variant-sizes">
													{sizes.map((size) => (
														<label key={size}>
															Talle {size}
															<input
																type="number"
																min="0"
																step="1"
																required
																value={variant.stockPorTalle[size]}
																disabled={savingProductId === product.id}
																onChange={(event) => updateVariantStock(
																	colorIndex,
																	size,
																	event.target.value,
																	product.id,
																)}
															/>
														</label>
													))}
												</div>
											</div>
										))}
										<div className="product-editor__add-color">
											<label>
												Agregar otro color
												<input
													value={draft.nuevoColor}
													disabled={savingProductId === product.id}
													onChange={(event) => updateDraft(
														product.id,
														'nuevoColor',
														event.target.value,
													)}
												/>
											</label>
											<button
												className="secondary-button"
												type="button"
												disabled={savingProductId === product.id}
												onClick={() => addVariantColor(product.id)}
											>
												Agregar color
											</button>
										</div>
									</fieldset>
									<div className="product-editor__actions">
										<button
											className="primary-button"
											type="submit"
											disabled={savingProductId === product.id}
										>
											{savingProductId === product.id ? 'Guardando...' : 'Guardar cambios'}
										</button>
										<button
											className="secondary-button"
											type="button"
											disabled={savingProductId === product.id}
											onClick={() => cancelEditing(product.id)}
										>
											Cancelar
										</button>
									</div>
								</form>
							)}
						</article>
					)
				})}
			</section>
		</main>
	)
}

export default ProductManagement
