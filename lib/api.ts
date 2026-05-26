import { Car } from './cars'

interface apiMoney {
	amount: number
	currency: string
}
const api = 'http://localhost:5107'
interface apiCar {
	id: string
	brand: string
	model: string
	year: number
	VIN: { value: string }
	price: apiMoney
	status: number
}
export interface apiListing {
	id: string
	sellerId: string
	status: number | null
	car: apiCar
	carId: string
	view: number
	city: string
	desc: string
	carImages: string[]
	listingStatus: number
	createdAt: string
	updatedAt: string | null
}
function ListingToCar(listing: apiListing): Car {
	const firstImage = listing.carImages?.[0]
	return {
		id: listing.id,
		name: listing.car.model,
		brand: listing.car.brand,
		year: listing.car.year,
		price: listing.car.price.amount,
		image: firstImage,
		featured: listing.status === 1,
		sellerId: listing.sellerId
	}
}

export async function fetchListing(): Promise<Car[]> {
	try {
		const result = await fetch(`${api}/api/listing`, { cache: 'no-store' })
		if (!result.ok) return []
		const data: apiListing[] = await result.json()
		return data.filter(d => d.car != null).map(ListingToCar)
	} catch {
		return []
	}
}
export async function fetchListingById(id: string): Promise<Car | null> {
	try {
		const result = await fetch(`${api}/api/listing/${id}`, {
			cache: 'no-store'
		})
		if (!result.ok) return null
		const data: apiListing = await result.json()
		return ListingToCar(data)
	} catch {
		return null
	}
}
