export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

let csrfTokenRequest = null

const methodsRequiringCsrf = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

async function getCsrfToken() {
	if (!csrfTokenRequest) {
		csrfTokenRequest = fetch(`${API_URL}/csrf`, {
			headers: { Accept: 'application/json' },
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(`No se pudo preparar la solicitud segura (HTTP ${response.status})`)
				}
				const data = await response.json()
				return data.token
			})
			.finally(() => {
				csrfTokenRequest = null
			})
	}
	return csrfTokenRequest
}

export async function apiRequest(path, options = {}) {
	const method = (options.method || 'GET').toUpperCase()
	const token = methodsRequiringCsrf.has(method) ? await getCsrfToken() : null
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		method,
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			...(options.body ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { 'X-XSRF-TOKEN': token } : {}),
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
