'use client'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CreateSellerFormSchema } from '@/lib/schemas'
import { useAuthStore } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import z from 'zod'

type CreateSellerData = z.infer<typeof CreateSellerFormSchema>

export default function CreateSellerForm() {
	const router = useRouter()
	const user = useAuthStore(x => x.user)
	const token = useAuthStore(x => x.token)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<CreateSellerData>({
		resolver: zodResolver(CreateSellerFormSchema)
	})

	async function onSubmit(data: CreateSellerData) {
		try {
			if (!user || !token) {
				router.push('/login')
				return
			}
			const response = await fetch('http://localhost:5107/seller', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					companyName: data.companyName,
					UserID: user.id,
					CompanyCity: data.city,
					CompanyAddress: data.address,
					CompanyPhoneNumber: data.mobilePhone,
					CompanyEmail: data.email
				})
			})
			if (!response.ok) {
				throw new Error('Failed to create seller')
			}
			localStorage.setItem('sellerId', await response.json())
			router.push('/seller/dashboard')
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<section className='flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16 md:px-12'>
			<div className='w-full max-w-md border border-border bg-card p-8 md:p-12 shadow-sm'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<div className='flex flex-col items-center gap-2 text-center'>
							<h1 className='text-2xl font-bold'>Become a Seller</h1>
							<FieldDescription>Create your seller profile to list vehicles</FieldDescription>
						</div>
						<Field>
							<FieldLabel htmlFor='companyName'>
								Company Name or Full Name
							</FieldLabel>
							<Input
								id='companyName'
								type='text'
								placeholder='BMW Salon or John Smith'
								{...register('companyName')}
							/>
							{errors.companyName && <p className='mt-1 text-sm text-destructive'>{errors.companyName.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor='city'>City</FieldLabel>
							<Input
								id='city'
								type='text'
								placeholder='Prague'
								{...register('city')}
							/>
							{errors.city && <p className='mt-1 text-sm text-destructive'>{errors.city.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor='companyAdress'>Company Address</FieldLabel>
							<Input
								id='companyAdress'
								type='text'
								placeholder='Dlouha 234'
								{...register('address')}
							/>
							{errors.address && <p className='mt-1 text-sm text-destructive'>{errors.address.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor='mobilePhone'>Mobile Phone</FieldLabel>
							<Input
								id='mobilePhone'
								type='text'
								placeholder='+420 000-000-000'
								{...register('mobilePhone')}
							/>
							{errors.mobilePhone && <p className='mt-1 text-sm text-destructive'>{errors.mobilePhone.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor='email'>Email</FieldLabel>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								{...register('email')}
							/>
							{errors.email && <p className='mt-1 text-sm text-destructive'>{errors.email.message}</p>}
						</Field>

						<Field>
							<Button type='submit' disabled={isSubmitting} size='lg' className='w-full'>
								{isSubmitting ? 'Creating...' : 'Create Profile'}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</div>
		</section>
	)
}
