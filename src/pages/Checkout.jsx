import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ShoePlaceholder from '../components/ShoePlaceholder.jsx'
import { apiRequest } from '../app/api.js'
import { formatPrice } from '../app/format.js'
import { fetchCartItems, resetCart } from '../store/slices/cartSlice.js'
import { useAuth } from '../context/useAuth.js'

function Checkout() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useAuth()
	const { items, loading, error: cartError, initialized } = useSelector((state) => state.cart)
	const [details, setDetails] = useState({
		nombre: user?.nombre || '',
		telefono: '',
		direccion: '',
		codigoPostal: '',
		ciudad: '',
		provincia: '',
	})
	const [metodoPago, setMetodoPago] = useState('TARJETA')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (user?.id && !initialized) dispatch(fetchCartItems(user.id))
	}, [dispatch, initialized, user?.id])

	const subtotal = items.reduce(
		(total, item) =>
			total + (Number(item.subtotal) || Number(item.precioUnitario) * item.cantidad),
		0,
	)

	function handleChange(event) {
		setDetails((current) => ({ ...current, [event.target.name]: event.target.value }))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setSubmitting(true)

		try {
			const order = await apiRequest(`/usuarios/${user.id}/pedidos`, {
				method: 'POST',
				body: JSON.stringify({ ...details, metodoPago }),
			})
			dispatch(resetCart())
			navigate(`/pedido/${order.id}`, {
				replace: true,
				state: { checkoutSuccess: true },
			})
		} catch (err) {
			setError(err.message || 'No se pudo confirmar la compra')
		} finally {
			setSubmitting(false)
		}
	}

	if (loading && !initialized) {
		return <main className="store-page"><p className="muted">Preparando el checkout...</p></main>
	}

	if (cartError) {
		return (
			<main className="store-page">
				<p className="page-error" role="alert">{cartError}</p>
				<button className="secondary-button" type="button" onClick={() => dispatch(fetchCartItems(user.id))}>
					Reintentar
				</button>
			</main>
		)
	}

	if (items.length === 0) {
		return (
			<main className="store-page">
				<div className="empty-state">
					<h2>No hay productos para finalizar</h2>
					<p>Agregá productos al carrito antes de continuar con la compra.</p>
					<Link className="primary-button" to="/carrito">Volver al carrito</Link>
				</div>
			</main>
		)
	}

	return (
		<main className="store-page">
			<div className="checkout-steps" aria-label="Pasos de compra">
				<span>1 Envío</span>
				<span>2 Pago</span>
				<span>3 Confirmar</span>
			</div>
			<header className="page-heading">
				<h1>Finalizar compra</h1>
			</header>

			<div className="checkout-layout">
				<form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
					<section className="checkout-form-card">
						<div className="checkout-form-card__heading">
							<h2>Datos de envío</h2>
							<Link className="text-link" to="/perfil">¿Ya tenés cuenta? Perfil</Link>
						</div>
						<div className="checkout-fields">
							<div className="checkout-field">
								<label htmlFor="checkout-name">Nombre y apellido</label>
								<input
									id="checkout-name"
									name="nombre"
									value={details.nombre}
									onChange={handleChange}
									autoComplete="name"
									placeholder="Nombre completo"
									maxLength="120"
									required
								/>
							</div>
							<div className="checkout-field">
								<label htmlFor="checkout-phone">Teléfono</label>
								<input
									id="checkout-phone"
									name="telefono"
									type="tel"
									value={details.telefono}
									onChange={handleChange}
									autoComplete="tel"
									placeholder="Teléfono"
									maxLength="40"
									required
								/>
							</div>
							<div className="checkout-field checkout-field--full">
								<label htmlFor="checkout-address">Dirección</label>
								<input
									id="checkout-address"
									name="direccion"
									value={details.direccion}
									onChange={handleChange}
									autoComplete="street-address"
									placeholder="Calle y número"
									maxLength="200"
									required
								/>
							</div>
							<div className="checkout-field checkout-field--third">
								<label htmlFor="checkout-postal">Código postal</label>
								<input
									id="checkout-postal"
									name="codigoPostal"
									value={details.codigoPostal}
									onChange={handleChange}
									autoComplete="postal-code"
									placeholder="0000"
									maxLength="20"
									required
								/>
							</div>
							<div className="checkout-field checkout-field--third">
								<label htmlFor="checkout-city">Ciudad</label>
								<input
									id="checkout-city"
									name="ciudad"
									value={details.ciudad}
									onChange={handleChange}
									autoComplete="address-level2"
									placeholder="Ciudad"
									maxLength="100"
									required
								/>
							</div>
							<div className="checkout-field checkout-field--third">
								<label htmlFor="checkout-province">Provincia</label>
								<input
									id="checkout-province"
									name="provincia"
									value={details.provincia}
									onChange={handleChange}
									autoComplete="address-level1"
									placeholder="Provincia"
									maxLength="100"
									required
								/>
							</div>
						</div>
					</section>

					<section className="checkout-form-card">
						<h2>Método de pago</h2>
						<div className="payment-options">
							<label className="payment-option">
								<span>Tarjeta de crédito / débito</span>
								<input
									type="radio"
									name="metodoPago"
									value="TARJETA"
									checked={metodoPago === 'TARJETA'}
									onChange={() => setMetodoPago('TARJETA')}
								/>
							</label>
							<label className="payment-option">
								<span>Transferencia o billetera</span>
								<input
									type="radio"
									name="metodoPago"
									value="TRANSFERENCIA"
									checked={metodoPago === 'TRANSFERENCIA'}
									onChange={() => setMetodoPago('TRANSFERENCIA')}
								/>
							</label>
						</div>
					</section>
					{error && <p className="page-error" role="alert">{error}</p>}
				</form>

				<aside className="summary-card">
					<h2>Tu pedido</h2>
					<div className="checkout-summary-items">
						{items.map((item) => (
							<div className="checkout-summary-item" key={item.id}>
								<div className="checkout-summary-item__image">
									<ShoePlaceholder />
								</div>
								<div>
									<strong>{item.productoNombre}</strong>
									<p>Talle {item.talle} · Cant. {item.cantidad}</p>
								</div>
								<strong>
									{formatPrice(Number(item.subtotal) || Number(item.precioUnitario) * item.cantidad)}
								</strong>
							</div>
						))}
					</div>
					<div className="summary-row">
						<span>Subtotal</span>
						<span>{formatPrice(subtotal)}</span>
					</div>
					<div className="summary-row">
						<span>Envío</span>
						<span>A coordinar</span>
					</div>
					<div className="summary-total">
						<span>Total</span>
						<span>{formatPrice(subtotal)}</span>
					</div>
					<button
						className="primary-button full-width"
						type="submit"
						form="checkout-form"
						disabled={submitting || loading}
					>
						{submitting ? 'Confirmando...' : 'Continuar al pago'}
					</button>
					<Link className="summary-card__continue" to="/carrito">Volver al carrito</Link>
				</aside>
			</div>
		</main>
	)
}

export default Checkout
