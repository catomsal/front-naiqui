import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../store/slices/favoriteSlice'

function FavoriteButton({ product }) {
  const dispatch = useDispatch()
  // Lee los favoritos desde el store global de Redux (favoriteSlice)
  const favoriteItems = useSelector((state) => state.favorite.items)
  const isFav = favoriteItems.some((item) => item.id === product?.id)

  function handleToggle() {
    if (!product) return
    // Dispara la acción toggleFavorite sincrónica del slice del profesor
    dispatch(toggleFavorite(product))
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
