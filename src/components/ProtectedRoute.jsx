import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

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
