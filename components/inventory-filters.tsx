'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select'

const BRANDS = [
	'All',
	'Tesla',
	'BMW',
	'Porsche',
	'Mercedes-Benz',
	'Audi',
	'Jaguar'
]

const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid']

const TRANSMISSIONS = ['All', 'Automatic', 'Manual']

const SORT_OPTIONS = [
	{ value: 'price-asc', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'year-asc', label: 'Year: Old to New' },
	{ value: 'year-desc', label: 'Year: New to Old' },
	{ value: 'mileage-asc', label: 'Mileage: Low to High' },
	{ value: 'mileage-desc', label: 'Mileage: High to Low' }
]

export default function InventoryFilters() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// /inventory?brand=All
	const brand = searchParams.get('brand') ?? 'All'
	const fuelType = searchParams.get('fuelType') ?? 'All'
	const transmission = searchParams.get('transmission') ?? 'All'
	const sort = searchParams.get('sort') ?? 'default'

	function updateParam(key: string, value: string) {
		const params = new URLSearchParams(searchParams.toString())

		if (value === 'All' || value === 'default') {
			params.delete(key)
		} else {
			params.set(key, value)
		}

		router.push(pathname + '?' + params.toString(), { scroll: false })
	}

	const hasActiveFilters =
		brand !== 'All' ||
		fuelType !== 'All' ||
		transmission !== 'All' ||
		sort !== 'default'

	return (
		<div className='mb-12 flex flex-wrap items-center gap-3'>
			<Select value={brand} onValueChange={v => updateParam('brand', v)}>
				<SelectTrigger className='h-10 min-w-3 uppercase'>
					<SelectValue placeholder='Brand' />
				</SelectTrigger>
				<SelectContent>
					{BRANDS.map(b => (
						<SelectItem key={b} value={b} className='text-xs uppercase'>
							{b === 'All' ? 'All brands' : b}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

/// Server: request -> html
//
//
// Client: html -> request -> browser()->html
