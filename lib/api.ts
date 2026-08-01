import { Car } from './cars'

interface apiMoney {
	amount: number
	currency: string
}
const api = 'http://test.carshop.sailybaev.kz'

// TODO: Replace with your Google Apps Script Web App URL after deployment.
// See google-apps-script/README.md for setup instructions.
const GOOGLE_APPS_SCRIPT_CONTACT_URL =
	'https://script.google.com/macros/s/AKfycbxmEfuhioGt9mxfbVxsL7fhRjzMdV--pdqfrLH8zgBWEe6NN_0lxpiktaOwjFE-Kpa9QQ/exec'

export interface ContactFormData {
	firstName: string
	lastName: string
	email: string
	message: string
}

interface apiCar {
	id: string
	brand: string
	model: string
	year: number
	mileage: string
	transmission: string
	fuelType: string
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
		mileage: listing.car.mileage,
		transmission: listing.car.transmission,
		fuelType: listing.car.fuelType,
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

export async function submitContactForm(
	data: ContactFormData
): Promise<{ success: boolean; message?: string; error?: string }> {
	try {
		const response = await fetch(GOOGLE_APPS_SCRIPT_CONTACT_URL, {
			method: 'POST',
			body: JSON.stringify({
				...data,
				source: 'CarShop Website'
			})
		})

		console.log('[submitContactForm] response.status:', response.status)

		if (response.status !== 200) {
			return {
				success: false,
				error: `Server responded with status ${response.status}.`
			}
		}

		let result: Record<string, unknown> | null = null

		try {
			result = await response.json()
			console.log('[submitContactForm] parsed result:', result)
		} catch (parseError) {
			console.warn('[submitContactForm] could not parse JSON:', parseError)
		}

		if (result && result.success === true) {
			return {
				success: true,
				message:
					typeof result.message === 'string'
						? result.message
						: 'Submission saved'
			}
		}

		if (
			result &&
			result.success === false &&
			typeof result.error === 'string'
		) {
			return { success: false, error: result.error }
		}

		return {
			success: true,
			message: 'Thank you. Your message has been received.'
		}
	} catch (networkError) {
		console.error('[submitContactForm] network error:', networkError)
		return {
			success: false,
			error: 'Failed to submit contact form. Please try again later.'
		}
	}
}
