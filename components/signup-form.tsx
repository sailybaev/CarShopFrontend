'use client'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SignUpFormSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { RowsIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select'

type SignUpData = z.infer<typeof SignUpFormSchema>

export default function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting }
	} = useForm<SignUpData>({ resolver: zodResolver(SignUpFormSchema) })

	const Register = useAuthStore(x => x.Register)
	const router = useRouter()
	const roles = [
		{ value: 'customer', label: 'Customer - want to Buy a car' },
		{ value: 'privateSeller', label: 'Private Seller - want to Sell a car' }
	]
	async function onSubmit(data: SignUpData) {
		try {
			await Register(data.email, data.password, data.role)
			router.push('/inventory')
		} catch (error: unknown) {
			console.log(error)
		}
	}
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
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
							Already have an account? <a href='/login'>Sign in</a>
						</FieldDescription>
					</div>
					<Field>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							id='email'
							type='email'
							placeholder='m@example.com'
							{...register('email')}
						/>
						{errors.email && <p>{errors.email.message}</p>}
					</Field>
					<Field>
						<FieldLabel htmlFor='password'>Password</FieldLabel>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							{...register('password')}
						/>
					</Field>
					{errors.password && <p>{errors.password.message}</p>}
					<Field>
						<FieldLabel htmlFor='role'>Role</FieldLabel>
						<Select
							onValueChange={value =>
								setValue('role', value as SignUpData['role'])
							}
						>
							<SelectTrigger id='role'>
								<SelectValue placeholder='Select role' />
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
					{errors.role && <p>{errors.role.message}</p>}
					<Field>
						<Button type='submit' disabled={isSubmitting}>
							Create Account
						</Button>
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
