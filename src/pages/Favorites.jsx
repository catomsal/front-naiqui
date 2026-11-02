import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFavorite, clearFavorites } from '../store/slices/favoriteSlice'

function Favorites() {
  const dispatch = useDispatch()
  // Lee las zapatillas favoritas desde el estado global de Redux (favoriteSlice)
  const favorites = useSelector((state) => state.favorite.items)

  const handleRemove = (productId) => {
    dispatch(removeFavorite(productId))
  }

  const handleClear = () => {
    dispatch(clearFavorites())
  }

  return (
    <main className="catalog">
      <header className="catalog__header">
        <p className="catalog__eyebrow">Favoritos (Redux Toolkit)</p>
        <h1>Mis zapatillas favoritas</h1>
        {favorites.length > 0 && (
          <p className="catalog__count">{favorites.length} zapatilla{favorites.length !== 1 ? 's' : ''} guardada{favorites.length !== 1 ? 's' : ''}</p>
        )}
      </header>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p className="catalog__message">No tenés zapatillas en favoritos.</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'underline' }}>
            Explorar catálogo de zapatillas
          </Link>
        </div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favorites.map((product) => {
              const precioFormateado = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                maximumFractionDigits: 0,
              }).format(product.precio || 0)

              return (
                <li
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: '1px solid #eee',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {product.imagenUrl && (
                      <img
                        src={product.imagenUrl}
                        alt={product.nombre}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                    <div>
                      <Link to={`/producto/${product.id}`} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {product.nombre}
                      </Link>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        {product.marca || 'Naiqui'} · {product.genero || 'Unisex'}
                      </p>
                      <strong>{precioFormateado}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/producto/${product.id}`} className="catalog__btn">
                      Ver zapatilla
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      style={{ background: 'none', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '4px', cursor: 'pointer', padding: '0.5rem 0.75rem' }}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to="/">Seguir explorando</Link>
            <button
              type="button"
              onClick={handleClear}
              style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Vaciar todos los favoritos
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default Favorites
