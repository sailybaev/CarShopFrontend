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
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export interface Car {
	id: string
	name: string
	brand: string
	year: number
	price: number
	image?: string
	featured?: boolean
}

interface Listings {
	sellerId: string
	moderationStatus: number
	car: Car
	carId: string
	view: number
	city: string
	description: string
	carImages: string[]
	listingStatus: number
}

export default function CreateNewListing() {
	const [carBrand, setCarBrand] = useState('')
	const [carModel, setCarModel] = useState('')
	const [carYear, setCarYear] = useState('')
	const [carPrice, setCarPrice] = useState('')
	const [carCurrency, setCarCurrency] = useState('')
	const [carCity, setCarCity] = useState('')
	const [carDescription, setCarDescription] = useState('')

	const router = useRouter()
	const { token } = useAuth()
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const [images, setImages] = useState<File[]>([])
	const [previews, setPreviews] = useState<string[]>([])

	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? [])
		setImages(prev => [...prev, ...files])

		const previewUrls = files.map(file => URL.createObjectURL(file))

		setPreviews(prev => [...prev, ...previewUrls])
	}
	function removeImage(index: number) {
		setImages(prev => prev.filter((_, i) => i !== index))
		setPreviews(prev => prev.filter((_, i) => i !== index))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')

		const sellerId = localStorage.getItem('sellerId')

		if (!sellerId) {
			setError('Seller profile was not found')
			return
		}

		if (!token) {
			setError('You msut be logged in')
			return
		}
		try {
			setLoading(true)

			const carResponse = await fetch('https://carshop.sailybaev.kz/api/car', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					brand: carBrand,
					model: carModel,
					year: Number(carYear),
					price: Number(carPrice)
				})
			})
			if (!carResponse.ok) {
				throw new Error('Failed to create car')
			}
			const carId = await carResponse.text()

			const formData = new FormData()
			formData.append('sellerId', sellerId)
			formData.append('carId', carId)
			formData.append('city', carCity)
			formData.append('description', carDescription)

			previews.forEach(image => {
				formData.append('carImages', image)
			})

			const listingResponse = await fetch(
				'https://carshop.sailybaev.kz/api/listing',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`
					},
					body: formData
				}
			)

			if (!listingResponse.ok) throw new Error('Failed to create listing')

			router.push('/seller/dashboard')
		} catch (error) {
			console.log(error)
			setError(error instanceof Error ? error.message : 'Something went wrong')
		} finally {
			setLoading(false)
		}
	}
	return (
		<section className='px-8 py-20'>
			<div className='mx-auto'>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<div className='flex flex-col items-center gap-2 text-center'>
							<h1 className='text-xl font-bold'>Create New Listing</h1>
							<FieldDescription>
								Add car details, listing information and vehicle photos
							</FieldDescription>
						</div>
						<Field>
							<FieldLabel htmlFor='carBrand'>Car Brand</FieldLabel>
							<Input
								id='carBrand'
								type='text'
								placeholder='BMW'
								value={carBrand}
								onChange={e => setCarBrand(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='carModel'>Model</FieldLabel>
							<Input
								id='carModel'
								type='text'
								placeholder='X5'
								value={carModel}
								onChange={e => setCarModel(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='carYear'>Year</FieldLabel>
							<Input
								id='carYear'
								type='number'
								placeholder='2005'
								value={carYear}
								onChange={e => setCarYear(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='carPrice'>Price</FieldLabel>
							<Input
								id='carPrice'
								type='number'
								placeholder='75,000'
								value={carPrice}
								onChange={e => setCarPrice(e.target.value)}
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor='carCity'>City</FieldLabel>
							<Input
								id='carCity'
								type='text'
								placeholder='Prague'
								value={carCity}
								onChange={e => setCarCity(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='carDescription'>Deccription</FieldLabel>
							<textarea
								id='description'
								placeholder='Describe the car condition, equipment and details...'
								value={carDescription}
								onChange={e => setCarDescription(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>Car Photos</FieldLabel>
							<input
								type='file'
								ref={fileInputRef}
								accept='image/*'
								multiple
								hidden
								onChange={handleImagesChange}
							/>

							<Button
								type='button'
								onClick={() => fileInputRef.current?.click()}
							>
								Upload Photos
							</Button>
							{previews.length > 0 && (
								<div className='mt-4 grid grid-cols-3 gap-4'>
									{previews.map((preview, index) => (
										<div key={preview} className='relative'>
											<img
												src={preview}
												alt='Car preview'
												className='h-32 w-full rounded-md object-cover'
											/>
											<Button
												type='button'
												className='absolute right-2 top-2 h-8 px-3 text-xs'
												onClick={() => removeImage(index)}
											>
												Delete
											</Button>
										</div>
									))}
								</div>
							)}
						</Field>
						{error && <p>{error}</p>}

						<Field>
							<Button type='submit' disabled={loading}>
								{loading ? 'Creating...' : 'Create Listing'}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</div>
		</section>
	)
}
