import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice.js'

function Cart() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.cart)

  // Obtiene los items del carrito desde el backend al montar el componente
  useEffect(() => {
    dispatch(fetchCartItems())
  }, [dispatch])

  // Llama a addToCart para que impacte directamente en la base de datos (POST /api/carrito)
  const handleAddToCart = (productoId, talle = 40, cantidad = 1) => {
    dispatch(addToCart({ productoId, talle, cantidad }))
  }

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId))
  }

  const handleClear = () => {
    dispatch(clearCart())
  }

  // Calcula el total del carrito de zapatillas
  const total = (items || []).reduce((acc, item) => {
    const precio = item.precioUnitario || item.precio || 0
    const cantidad = item.cantidad || 1
    return acc + precio * cantidad
  }, 0)

  return (
    <main className="catalog">
      <header className="catalog__header">
        <p className="catalog__eyebrow">Carrito de Compras (Redux Toolkit)</p>
        <h1>Mi carrito de zapatillas</h1>
        {loading && <p className="catalog__message">Sincronizando carrito con el servidor...</p>}
        {error && (
          <p className="catalog__message" style={{ color: '#dc2626' }}>
            {error}
          </p>
        )}
        {items && items.length > 0 && (
          <p className="catalog__count">{items.length} zapatilla{items.length !== 1 ? 's' : ''} en el carrito</p>
        )}
      </header>

      {(!items || items.length === 0) && !loading ? (
        <>
          <p className="catalog__message">Tu carrito de zapatillas está vacío.</p>
          <div style={{ margin: '1.5rem 0' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'underline' }}>
              Ir al catálogo para elegir zapatillas
            </Link>
            <br />
            {/* Botón para probar que impacta en la DB */}
            <button
              type="button"
              onClick={() => handleAddToCart(1, 41, 1)}
              style={{ cursor: 'pointer', padding: '0.6rem 1rem' }}
            >
              + Agregar zapatilla demo (Impacta en DB)
            </button>
          </div>
        </>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => {
              const itemId = item.id || item.productoId
              const nombre = item.nombreProducto || item.nombre || `Zapatilla #${itemId}`
              const precio = item.precioUnitario || item.precio || 0
              const cantidad = item.cantidad || 1
              const talle = item.talle ? `Talle: ${item.talle}` : 'Talle: 40'

              return (
                <li
                  key={item.id || `${itemId}-${item.talle}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: '1px solid #eee',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>{nombre}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      {talle} · Cantidad: {cantidad}
                    </p>
                    <strong style={{ color: '#2D3277', display: 'block', marginTop: '0.25rem' }}>
                      ${(precio * cantidad).toLocaleString('es-AR')}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.productoId || item.id, item.talle || 40, 1)}
                      title="Sumar 1 unidad en base de datos"
                      style={{ padding: '0.4rem 0.75rem', cursor: 'pointer' }}
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        cursor: 'pointer',
                        color: '#dc2626',
                        background: 'none',
                        border: '1px solid #dc2626',
                        borderRadius: '4px',
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div style={{ margin: '1.5rem 0', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <h2 style={{ margin: 0 }}>
              Total: ${total.toLocaleString('es-AR')}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button type="button" onClick={handleClear} style={{ cursor: 'pointer' }}>
              Vaciar carrito
            </button>
            <Link to="/" style={{ alignSelf: 'center' }}>
              Seguir comprando
            </Link>
          </div>
        </>
      )}
    </main>
  )
}

export default Cart
