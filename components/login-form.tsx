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
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const  Login  = useAuthStore(x=>x.Login)
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		try {
			await Login(email, password)
			router.push('/inventory')
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : 'Login failed')
		}
	}
	return (
		<div className={cn('flex flex-col gap-8', className)} {...props}>
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<div className='flex flex-col items-center gap-3 text-center'>
						<Link href='/' className='text-xl font-bold uppercase tracking-[0.18em]'>
							CarHub
						</Link>
						<h1 className='text-2xl font-bold'>Welcome back</h1>
						<FieldDescription>
							Don&apos;t have an account? <Link href='/signup' className='font-semibold text-foreground hover:underline'>Sign up</Link>
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
					{error && (
						<p className='text-sm text-destructive' role='alert'>
							{error}
						</p>
					)}
					<Field>
						<Button type='submit' size='lg' className='w-full'>
							Login
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className='text-center'>
				By clicking continue, you agree to our <a href='#' className='font-semibold text-foreground hover:underline'>Terms of Service</a> and <a href='#' className='font-semibold text-foreground hover:underline'>Privacy Policy</a>.
			</FieldDescription>
		</div>
	)
}
