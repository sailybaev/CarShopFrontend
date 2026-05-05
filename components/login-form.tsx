'use client'

import { useAuth } from '@/app/context/authProvider'
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

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { Login } = useAuth()
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		try {
			await Login(email, password)
			router.push('/inventory')
		} catch (error: unknown) {
			console.log(error)
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
							<span className='sr-only'>Acme Inc.</span>
						</a>
						<h1 className='text-xl font-bold'>Welcome to Acme Inc.</h1>
						<FieldDescription>
							Don&apos;t have an account? <a href='/signup'>Sign up</a>
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
						<Button type='submit'>Login</Button>
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
