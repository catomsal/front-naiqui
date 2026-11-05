export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export async function apiRequest(path, options = {}) {
	const token = localStorage.getItem('token')
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			Accept: 'application/json',
			...(options.body ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	})

	const contentType = response.headers.get('content-type') || ''
	const data =
		response.status === 204
			? null
			: contentType.includes('application/json')
				? await response.json()
				: await response.text()

	if (!response.ok) {
		const message =
			data?.mensaje ||
			data?.message ||
			(typeof data === 'string' && data) ||
			`Error ${response.status}: no se pudo completar la solicitud`
		throw new Error(message)
	}

	return data
}
