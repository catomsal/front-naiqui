import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function StaffRoute({ children }) {
	const { user } = useAuth()
	const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.rol?.toUpperCase())

	if (!isStaff) {
		return <Navigate to="/" replace />
	}

	return children
}

export default StaffRoute
