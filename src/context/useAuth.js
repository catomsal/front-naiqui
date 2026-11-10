import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, setSession, updateSession } from '../store/slices/authSlice.js'

export function useAuth() {
	const dispatch = useDispatch()
	const { user, isLoading } = useSelector((state) => state.auth)
	const login = useCallback((session) => dispatch(setSession(session)), [dispatch])
	const logout = useCallback(() => dispatch(logoutUser()).unwrap(), [dispatch])
	const updateUser = useCallback((updates) => dispatch(updateSession(updates)), [dispatch])

	return { user, isLoading, login, logout, updateUser }
}
