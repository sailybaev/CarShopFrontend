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
import Link from 'next/link'
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
		<div className={cn('flex flex-col gap-8', className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className='flex flex-col items-center gap-3 text-center'>
						<Link href='/' className='text-xl font-bold uppercase tracking-[0.18em]'>
							CarHub
						</Link>
						<h1 className='text-2xl font-bold'>Create account</h1>
						<FieldDescription>
							Already have an account? <Link href='/login' className='font-semibold text-foreground hover:underline'>Sign in</Link>
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
						{errors.email && <p className='text-sm text-destructive mt-1'>{errors.email.message}</p>}
					</Field>
					<Field>
						<FieldLabel htmlFor='password'>Password</FieldLabel>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							{...register('password')}
						/>
						{errors.password && <p className='text-sm text-destructive mt-1'>{errors.password.message}</p>}
					</Field>
					<Field>
						<FieldLabel htmlFor='role'>Role</FieldLabel>
						<Select
							onValueChange={value =>
								setValue('role', value as SignUpData['role'])
							}
						>
							<SelectTrigger id='role' className='h-12'>
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
						{errors.role && <p className='text-sm text-destructive mt-1'>{errors.role.message}</p>}
					</Field>
					<Field>
						<Button type='submit' disabled={isSubmitting} size='lg' className='w-full'>
							{isSubmitting ? 'Creating...' : 'Create Account'}
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
