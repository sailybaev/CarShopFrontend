import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
	id: string
	email: string
	role: string
}
interface AuthContextType {
	user: AuthUser | null
	token: string | null
	Login: (email: string, password: string) => Promise<void>
	Register: (password: string, email: string, role: string) => Promise<void>
	Logout: () => void
}
const url = 'http://localhost:5107'
function decodeToken(token: string): AuthUser | null {
	try {
		const payload = token.split('.')[1]
		const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
		return {
			id:
				json[
					'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
				] ?? '',
			email:
				json[
					'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
				] ?? '',
			role:
				json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
				''
		}
	} catch {
		return null
	}
}
async function postForm(
	apiEnd: string,
	body: Record<string, string>
): Promise<string> {
	const form = new FormData()
	Object.entries(body).forEach(([key, value]) => form.append(key, value))
	const token = await fetch(`${url}/api/auth/${apiEnd}`, {
		method: 'POST',
		body: form
	})
	if (!token.ok) throw new Error('Error')

	return token.text()
}
export const useAuthStore = create<AuthContextType>()(
	persist(
		set => ({
			user: null,
			token: null,
			async Login(email, password) {
				const token = await postForm('login', { email, password })
				set({ token, user: decodeToken(token) })
			},
			async Register(email, password, role) {
				const token = await postForm('register', { email, password, role })
				set({ token, user: decodeToken(token) })
			},
			Logout() {
				set({ token: null, user: null })
			}
		}),
		{
			name: 'token'
		}
	)
)
