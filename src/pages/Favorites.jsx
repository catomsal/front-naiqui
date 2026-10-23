import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/useAuth.js'
import {
  clearFavorites,
  fetchFavorites,
  removeFavoriteLocal,
  removeFavoriteServer,
  selectFavorites,
  selectFavoritesError,
  selectFavoritesStatus,
} from '../features/favorites/favoritesSlice'

function Favorites() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const favorites = useSelector(selectFavorites)
  const status = useSelector(selectFavoritesStatus)
  const error = useSelector(selectFavoritesError)

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id))
    }
  }, [dispatch, user])

  function handleRemove(productId) {
    if (user) {
      dispatch(removeFavoriteServer({ usuarioId: user.id, productId }))
    } else {
      dispatch(removeFavoriteLocal(productId))
    }
  }

  function handleClear() {
    if (user) {
      favorites.forEach((item) =>
        dispatch(removeFavoriteServer({ usuarioId: user.id, productId: item.id })),
      )
    }
    dispatch(clearFavorites())
  }

  return (
    <main className="catalog">
      <header className="catalog__header">
        <p className="catalog__eyebrow">Favoritos</p>
        <h1>Mis favoritos</h1>
        {favorites.length > 0 && <p className="catalog__count">{favorites.length} productos</p>}
      </header>

      {error && <p className="catalog__message">Error: {error}</p>}
      {status === 'loading' && <p className="catalog__message">Cargando favoritos...</p>}

      {status !== 'loading' && favorites.length === 0 ? (
        <p className="catalog__message">Todavía no tenés productos favoritos.</p>
      ) : (
        <>
          <ul>
            {favorites.map((product) => (
              <li key={product.id}>
                <Link to={`/producto/${product.id}`}>{product.nombre}</Link> - $
                {product.precio}
                <button type="button" onClick={() => handleRemove(product.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          {favorites.length > 0 && (
            <button type="button" onClick={handleClear}>
              Vaciar favoritos
            </button>
          )}
        </>
      )}

      <Link to="/">Seguir comprando</Link>
    </main>
  )
}

export default Favorites
