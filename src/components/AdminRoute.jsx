import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function AdminRoute({ children }) {
	const { user } = useAuth()

	if (user?.rol?.toUpperCase() !== 'ADMIN') {
		return <Navigate to="/" replace />
	}

	return children
}

export default AdminRoute
