import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite, toggleFavoriteOnServer } from '../store/slices/favoriteSlice.js'
import { useAuth } from '../context/useAuth.js'

function FavoriteButton({ product }) {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const favoriteItems = useSelector((state) => state.favorite.items)
  const favoriteLoading = useSelector((state) => state.favorite.loading)
  const isFav = favoriteItems.some((item) => item.id === product?.id)

  function handleToggle() {
    if (!product) return
    if (user?.id) {
      dispatch(toggleFavoriteOnServer({ userId: user.id, product, isFavorite: isFav }))
      return
    }
    dispatch(toggleFavorite(product))
  }

  return (
    <button
      className={`favorite-button${isFav ? ' favorite-button--active' : ''}`}
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isFav}
      disabled={Boolean(user?.id && favoriteLoading)}
    >
      {isFav ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton
