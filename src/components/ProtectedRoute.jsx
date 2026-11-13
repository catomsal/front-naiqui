import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'


// Ruta protegida: solo deja ver la página si hay un usuario logueado.
// - Mientras isLoading es true se muestra un mensaje, porque todavía no sabemos si hay sesión.
// - Si no hay usuario, redirige a /login (replace evita volver con "Atrás") y guarda
//   la ruta original en state.from para volver después de loguearse.
// - Si hay usuario, renderiza los children.

function ProtectedRoute({ children }) {
	const { user, isLoading } = useAuth()
	const location = useLocation()

	if (isLoading) {
		return <p className="catalog__message">Verificando sesión...</p>
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	return children
}

export default ProtectedRoute
