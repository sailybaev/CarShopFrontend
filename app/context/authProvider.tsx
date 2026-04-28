'use client'
import { createContext, useContext, useEffect, useState } from 'react'

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
const authContext = createContext<AuthContextType | null>(null)
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
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null)
	const [user, setUser] = useState<AuthUser | null>(null)

	useEffect(() => {
		const savedToken = localStorage.getItem('token')
		if (savedToken) {
			const decoded = decodeToken(savedToken)
			if (decoded) {
				setToken(savedToken)
				setUser(decoded)
			} else {
				localStorage.removeItem('token')
			}
		}
	}, [])
	 async function Login(email: string, password: string) {
		const t = await postForm('login', { email, password })
		localStorage.setItem('token', t)
		setToken(t)
		setUser(decodeToken(t))
	}
	async function Register(email: string, password: string, role: string) {
		const t = await postForm('register', { email, password, role })
		localStorage.setItem('token', t)
		setToken(t)
		setUser(decodeToken(t))
	}
	function Logout(){
		localStorage.removeItem('token')
		setToken(null)
		setUser(null)
	}
	return(
		<authContext.Provider value={{user, token, Login, Register, Logout}}>
			{children}
		</authContext.Provider>
	)
}
export function useAuth(){
	const items = useContext(authContext)
	if(!items) throw new Error('useAuth must be used inside of authProvider')
	return items
}
