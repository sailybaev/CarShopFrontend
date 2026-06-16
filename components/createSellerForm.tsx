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
		<div>
			{errors.companyName && <p>{errors.companyName.message}</p>}
			{errors.address && <p>{errors.address.message}</p>}
			{errors.city && <p>{errors.city.message}</p>}
			{errors.email && <p>{errors.email.message}</p>}
			{errors.mobilePhone && <p>{errors.mobilePhone.message}</p>}

			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className='flex flex-col items-center gap-2 text-center'>
						<h1 className='text-xl font-bold'>Create Private Seller Profile</h1>
						<FieldDescription>Sell your car</FieldDescription>
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
					</Field>
					<Field>
						<FieldLabel htmlFor='city'>City</FieldLabel>
						<Input
							id='city'
							type='text'
							placeholder='Prague'
							{...register('city')}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='companyAdress'>Company Adress</FieldLabel>
						<Input
							id='companyAdress'
							type='text'
							placeholder='Dlouha 234'
							{...register('address')}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='mobilePhone'>Mobile Phone</FieldLabel>
						<Input
							id='mobilePhone'
							type='text'
							placeholder='+420 000-000-000'
							{...register('mobilePhone')}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							id='email'
							type='email'
							placeholder='m@example.com'
							{...register('email')}
						/>
					</Field>

					<Field>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create'}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	)
}
