'use client'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { RowsIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select'
import { useAuthStore } from '@/store/authStore'

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('')
	const [error, setError] = useState('')
	const Register = useAuthStore(x=>x.Register)
	const router = useRouter()
	const roles = [
		{ value: 'customer', label: 'Customer - want to Buy a car' },
		{ value: 'privateSeller', label: 'Private Seller - want to Sell a car' }
	]
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		try {
			await Register(email, password, role)
			router.push('/inventory')
		} catch (error: unknown) {
			console.log(error)
			setError(error instanceof Error ? error.message : '')
		}
	}
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<div className='flex flex-col items-center gap-2 text-center'>
						<a
							href='#'
							className='flex flex-col items-center gap-2 font-medium'
						>
							<div className='flex size-8 items-center justify-center rounded-md'>
								<RowsIcon className='size-6' />
							</div>
							<span className='sr-only'>Acme Inc.{error}</span>
						</a>
						<h1 className='text-xl font-bold'>Welcome to Acme Inc.</h1>
						<FieldDescription>
							Already have an account? <a href='/login'>Sign in</a>
						</FieldDescription>
					</div>
					<Field>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							id='email'
							type='email'
							placeholder='m@example.com'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='password'>Password</FieldLabel>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='role'>Role</FieldLabel>
						<Select value={role} onValueChange={setRole}>
							<SelectTrigger id='role'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{roles.map(r => (
									<SelectItem key={r.value} value={r.value}>
										{r.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Button type='submit'>Create Account</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className='px-6 text-center'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</FieldDescription>
		</div>
	)
}
