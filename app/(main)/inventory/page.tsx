'use client'

import InventoryFilters from '@/components/inventory-filters'
import InventoryHeader from '@/components/inventoryHeader'
import InventorySection from '@/components/sections/inventorySection'
import { fetchListing } from '@/lib/api'
import { Car } from '@/lib/cars'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function filterCars(allCars: Car[], brand: string): Car[] {
	return allCars.filter(car => {
		if (brand !== 'All' && car.brand !== brand) return false

		return true
	})
}

function sortCars(filteredCars: Car[], sort: string): Car[] {
	const sorted = [...filteredCars]

	switch (sort) {
		case 'price-asc':
			sorted.sort((a, b) => a.price - b.price)
			break
		case 'price-desc':
			sorted.sort((a, b) => b.price - a.price)
			break

		case 'year-asc':
			sorted.sort((a, b) => a.year - b.year)
			break
		case 'year-desc':
			sorted.sort((a, b) => b.year - a.year)
			break
	}
	return sorted
}

function InventoryContent() {
	const params = useSearchParams()
	const { data, isLoading } = useQuery<Car[]>({
		queryKey: ['listings'],
		queryFn: fetchListing,
		staleTime: 60000
	})
	const brand = params.get('brand') ?? 'All'
	const sort = params.get('sort') ?? 'price'
	const filtered = filterCars(data ?? [], brand)
	const sorted = sortCars(filtered, sort)

	return (
		<>
			<InventoryFilters />
			{isLoading && <p className='px-6 py-4 text-center text-muted-foreground'>Loading...</p>}
			<InventorySection Cars={sorted} />
		</>
	)
}

export default function InventoryPage() {
	return (
		<>
			<InventoryHeader
				text1='Our Collection'
				text2='Vehicle Inventory'
				text3='Explore our curated collection of premium vehicles. Find the perfect car tailored to your lifestyle and preferences.'
			/>

			<Suspense fallback={<p className='px-6 py-4 text-center text-muted-foreground'>Loading...</p>}>
				<InventoryContent />
			</Suspense>
		</>
	)
}
