import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/useAuth.js'
import {
  addFavoriteServer,
  removeFavoriteServer,
  selectIsFavorite,
  toggleFavoriteLocal,
} from '../features/favorites/favoritesSlice'

function FavoriteButton({ product }) {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const isFav = useSelector(selectIsFavorite(product?.id))

  function handleToggle() {
    if (!product) return

    if (user) {
      if (isFav) {
        dispatch(removeFavoriteServer({ usuarioId: user.id, productId: product.id }))
      } else {
        dispatch(addFavoriteServer({ usuarioId: user.id, product }))
      }
    } else {
      dispatch(toggleFavoriteLocal(product))
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFav ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
    </button>
  )
}

export default FavoriteButton
