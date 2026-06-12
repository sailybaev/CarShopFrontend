import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/store/authStore'
import { fireEvent, getByLabelText, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush
	})
}))
describe('Login form', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	it('renders login form', () => {
		render(React.createElement(LoginForm))
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Password')).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
		expect(screen.getByText('Sign up')).toBeInTheDocument()
	})
	it('allows user to type email and pass', () => {
		render(<LoginForm />)
		const emailInput = screen.getByLabelText('Email')
		const passwordInput = screen.getByLabelText('Password')
		fireEvent.change(emailInput, {
			target: { value: 'test@test.com' }
		})

		fireEvent.change(passwordInput, {
			target: { value: '123456' }
		})

		expect(emailInput).toHaveValue('test@test.com')
		expect(passwordInput).toHaveValue('123456')
	})
	it('calls login and redirect after submit', async () => {
		useAuthStore.setState({ Login: vi.fn().mockResolvedValue(undefined) })

		render(<LoginForm />)
		const emailInput = screen.getByLabelText('Email')
		const pasInput = screen.getByLabelText('Password')
		fireEvent.change(emailInput, {
			target: { value: 'test@test.cz' }
		})
		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: '123456' }
		})
		
		expect(emailInput).toHaveValue('test@test.cz')
		expect(pasInput).toHaveValue('123456')
		fireEvent.click(screen.getByRole('button'))
		
		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/inventory')
		})
	})
	it('does not redirect if Login fails', async () => {
		const mockLogin = vi.fn().mockRejectedValue(new Error('Login failed'))

		useAuthStore.setState({
			Login: mockLogin
		})

		render(<LoginForm />)

		fireEvent.change(screen.getByLabelText('Email'), {
			target: { value: 'test@test.com' }
		})

		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: 'wrong' }
		})

		fireEvent.click(screen.getByRole('button', { name: 'Login' }))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalled()
		})

		expect(vi.fn()).not.toHaveBeenCalled()
	})
})
