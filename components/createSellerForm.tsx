'use client'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateSellerForm() {
	const router = useRouter()
	const [companyName, setCompanyName] = useState('')
	const [companyCity, setCompanyCity] = useState('')
	const [companyAddress, setCompanyAddress] = useState('')
	const [companyPhoneNumber, setCompanyPhoneNumber] = useState('')
	const [companyEmail, setCompanyEmail] = useState('')
	const user = useAuthStore(x => x.user)
	const token = useAuthStore(x => x.token)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
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
					companyName,
					UserID: user.id,
					CompanyCity: companyCity,
					CompanyAddress: companyAddress,
					CompanyPhoneNumber: companyPhoneNumber,
					CompanyEmail: companyEmail
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
			<form onSubmit={handleSubmit}>
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
							id='sellerCompanyName'
							type='text'
							placeholder='BMW Salon or John Smith'
							value={companyName}
							onChange={e => setCompanyName(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='city'>City</FieldLabel>
						<Input
							id='sellerCity'
							type='text'
							placeholder='Prague'
							value={companyCity}
							onChange={e => setCompanyCity(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='companyAdress'>Company Adress</FieldLabel>
						<Input
							id='sellerAdress'
							type='text'
							placeholder='Dlouha 234'
							value={companyAddress}
							onChange={e => setCompanyAddress(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='mobilePhone'>Mobile Phone</FieldLabel>
						<Input
							id='sellerPhone'
							type='text'
							placeholder='+420 000-000-000'
							value={companyPhoneNumber}
							onChange={e => setCompanyPhoneNumber(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							id='sellerEmail'
							type='email'
							placeholder='m@example.com'
							value={companyEmail}
							onChange={e => setCompanyEmail(e.target.value)}
							required
						/>
					</Field>

					<Field>
						<Button type='submit'>Create</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	)
}
