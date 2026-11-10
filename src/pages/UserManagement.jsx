import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../app/api.js'
import { useAuth } from '../context/useAuth.js'

const roles = ['USUARIO', 'VENDEDOR', 'ADMIN']

function UserManagement() {
	const { user, updateUser } = useAuth()
	const navigate = useNavigate()
	const [users, setUsers] = useState([])
	const [roleChanges, setRoleChanges] = useState({})
	const [savingUserId, setSavingUserId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [feedback, setFeedback] = useState({})

	useEffect(() => {
		let isCurrent = true
		apiRequest('/usuarios')
			.then((data) => {
				if (isCurrent) setUsers(data)
			})
			.catch((err) => {
				if (isCurrent) setError(err.message || 'No se pudieron cargar los usuarios.')
			})
			.finally(() => {
				if (isCurrent) setLoading(false)
			})

		return () => {
			isCurrent = false
		}
	}, [])

	async function saveRole(targetUser) {
		const selectedRole = roleChanges[targetUser.id] || targetUser.rol
		if (selectedRole === targetUser.rol) return

		setSavingUserId(targetUser.id)
		setError('')
		setFeedback((current) => ({ ...current, [targetUser.id]: '' }))
		try {
			const updatedUser = await apiRequest(`/usuarios/${targetUser.id}/rol`, {
				method: 'PATCH',
				body: JSON.stringify({ rol: selectedRole }),
			})
			setUsers((current) => current.map((item) => item.id === updatedUser.id ? updatedUser : item))
			setRoleChanges((current) => {
				const next = { ...current }
				delete next[targetUser.id]
				return next
			})
			setFeedback((current) => ({ ...current, [targetUser.id]: 'Rol actualizado.' }))

			if (updatedUser.id === user.id) {
				updateUser({ rol: updatedUser.rol })
				if (updatedUser.rol !== 'ADMIN') navigate('/', { replace: true })
			}
		} catch (err) {
			setFeedback((current) => ({
				...current,
				[targetUser.id]: err.message || 'No se pudo actualizar el rol.',
			}))
		} finally {
			setSavingUserId(null)
		}
	}

	if (loading) return <main className="store-page"><p className="muted">Cargando usuarios...</p></main>
	if (error) return <main className="store-page"><p className="page-error" role="alert">{error}</p></main>

	return (
		<main className="store-page">
			<header className="page-heading">
				<h1>Administrar usuarios</h1>
				<p>{users.length} usuarios</p>
			</header>
			<section className="user-management-list" aria-label="Usuarios y roles">
				{users.map((targetUser) => {
					const selectedRole = roleChanges[targetUser.id] || targetUser.rol
					return (
						<article className="user-role-card" key={targetUser.id}>
							<div className="user-role-card__identity">
								<strong>{targetUser.nombre}</strong>
								<span>{targetUser.email}</span>
							</div>
							<label className="user-role-card__control" htmlFor={`user-role-${targetUser.id}`}>
								Rol
								<select
									id={`user-role-${targetUser.id}`}
									value={selectedRole}
									disabled={savingUserId === targetUser.id}
									onChange={(event) => {
										setRoleChanges((current) => ({
											...current,
											[targetUser.id]: event.target.value,
										}))
										setFeedback((current) => ({ ...current, [targetUser.id]: '' }))
									}}
								>
									{roles.map((role) => <option key={role} value={role}>{role}</option>)}
								</select>
							</label>
							<div className="user-role-card__action">
								{feedback[targetUser.id] && (
									<p
										className={selectedRole === targetUser.rol ? 'page-success' : 'page-error'}
										role="status"
									>
										{feedback[targetUser.id]}
									</p>
								)}
								<button
									className="secondary-button"
									type="button"
									disabled={savingUserId === targetUser.id || selectedRole === targetUser.rol}
									onClick={() => saveRole(targetUser)}
								>
									{savingUserId === targetUser.id ? 'Guardando...' : 'Guardar rol'}
								</button>
							</div>
						</article>
					)
				})}
			</section>
		</main>
	)
}

export default UserManagement
