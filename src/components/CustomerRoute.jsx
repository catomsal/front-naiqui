import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function CustomerRoute({ children }) {
	const { user } = useAuth()
	const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())

	if (isStaff) {
		return <Navigate to="/productos/gestionar" replace />
	}

	return children
}

export default CustomerRoute
