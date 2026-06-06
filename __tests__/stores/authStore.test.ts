import { AuthUser, useAuthStore } from '@/store/authStore'
import { vi, beforeEach, describe, afterEach, it } from 'vitest'

function createMockJwt(id: string, email: string, role: string): string {
	const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
	const payload = btoa(
		JSON.stringify({
			'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':
				id,
			'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
				email,
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role
		})
	)
	return `${header}.${payload}.fakesignature`
}

const testUser: AuthUser = {
	id: '5',
	email: 'test@mail.com',
	role: 'customer'
}
beforeEach(() => {
	useAuthStore.setState({ user: null, token: null })
	vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
	vi.unstubAllGlobals()
})
describe('Login', () => {
	it('test1', async () => {
		const mockToken = createMockJwt('5', 'test@mail.com', 'customer')

		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			text: vi.fn().mockResolvedValueOnce(mockToken)
		} as unknown as Response)

		await useAuthStore.getState().Login('test@mail.com', '123')
		const token = useAuthStore.getState().token
		const user = useAuthStore.getState().user
		expect(user).toMatchObject({
			id: '5',
			email: 'test@mail.com',
			role: 'customer'
		})
		expect(token).toBe(mockToken)
	})
})

describe('useAuthStore initial state', () => {
	it('user null', () => {
		expect(useAuthStore.getState().user).toBe(null)
	})
	it('token null', () => {
		expect(useAuthStore.getState().token).toBe(null)
	})
})
describe('Logout tests', () => {
	it('user to be null', () => {
		useAuthStore.setState({
			user: testUser,
			token: '123'
		})
		useAuthStore.getState().Logout()
		expect(useAuthStore.getState().user).toBeNull()
	})
	it('token to be null', () => {
		useAuthStore.setState({
			user: testUser,
			token: '123'
		})
		useAuthStore.getState().Logout()
		expect(useAuthStore.getState().token).toBeNull()
	})
})
