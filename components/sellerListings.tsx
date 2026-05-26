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
import { useAuth } from '@/app/context/authProvider'
import Link from 'next/link'
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
	
	const {token} = useAuth()

	

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

	return (
		<section>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Car</TableHead>
						<TableHead>City</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Listing Status</TableHead>
						<TableHead>Moderation Status</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{listings.map(listing => (
						<TableRow key={listing.carId}>
							<TableCell>
								{listing.car.brand} {listing.car.name} {listing.car.year}
							</TableCell>
							<TableCell>{listing.city}</TableCell>
							<TableCell>{listing.car.price}</TableCell>
							<TableCell>{listing.listingStatus}</TableCell>
							<TableCell>{listing.moderationStatus}</TableCell>
							<TableCell>
								<Button>
									<Link href={`/seller/listings/${listing.id}/edit`}>Edit
									</Link>
									
								</Button>
								<Button
									type='button'
									onClick={()=> deleteListing(listing.id)}>Delete</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			
		</section>
	)
}
