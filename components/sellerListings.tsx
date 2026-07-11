'use client'

import { Car } from '@/lib/cars'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from './ui/table'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

interface Listings {
	id: string
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

export default function SellerListings() {
	const [listings, setListing] = useState<Listings[]>([])
	const [loading, setLoading] = useState(true)

	const token = useAuthStore(t=>t.token)

	useEffect(() => {
		const sellerId = localStorage.getItem('sellerId')
		if (!sellerId) {
			console.log('no sellerId')
		}
		async function getSellerListings() {
			const response = await fetch(`http://localhost:5107/api/listing`)

			if (!response.ok) {
				throw new Error('Failed')
			}
			const data = await response.json()
			const sellerListings = data.filter(
				(listing: Listings) => listing.sellerId === sellerId
			)
			setListing(sellerListings)
			setLoading(false)
		}
		getSellerListings()
	}, [])

	async function deleteListing(id: string){
		if(!token) return
		const response = await fetch(`http://localhost:5107/api/listing/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		if(!response.ok){
			console.log('Failed to delete listing')
			return
		}
		setListing(prev => prev.filter(listing => listing.id !== id))
	}

	if (loading) {
		return <p className='px-6 py-12'>Loading listings...</p>
	}

	return (
		<section className='px-6 py-12 md:px-12 md:py-16'>
			<div className='mx-auto max-w-7xl'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Car</TableHead>
							<TableHead>City</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Listing Status</TableHead>
							<TableHead>Moderation Status</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{listings.map(listing => (
							<TableRow key={listing.id}>
								<TableCell className='font-medium'>
									{listing.car.brand} {listing.car.name} {listing.car.year}
								</TableCell>
								<TableCell>{listing.city}</TableCell>
								<TableCell>{listing.car.price}</TableCell>
								<TableCell>{listing.listingStatus}</TableCell>
								<TableCell>{listing.moderationStatus}</TableCell>
								<TableCell className='flex justify-end gap-2'>
									<Button size='sm' asChild>
										<Link href={`/seller/listings/${listing.id}/edit`}>Edit</Link>
									</Button>
									<Button
										size='sm'
										variant='destructive'
										type='button'
										onClick={()=> deleteListing(listing.id)}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</section>
	)
}
