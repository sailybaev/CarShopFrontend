'use client'

import InventoryFilters from '@/components/inventory-filters'
import InventoryHeader from '@/components/inventoryHeader'
import InventorySection from '@/components/sections/inventorySection'
import { fetchListing } from '@/lib/api'
import { Car } from '@/lib/cars'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'



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

export default  function InventoryPage() {
	const params =  useSearchParams()

	const brand = params.get('brand') ?? 'All'
	const [allCars, setAllcars] = useState<Car[]>([])
	const sort = params.get('sort') ?? 'price'
	const filtered = filterCars(allCars, brand)
	const sorted = sortCars(filtered, sort)

	useEffect(() => {
		fetchListing().then(c => setAllcars(c))
	}, [])
	return (
		<>
			<InventoryHeader
				text1='Our Collection'
				text2='Vehicle Inventory'
				text3='Explore our curated collection of premium vehicles. Find the perfect car tailored to your lifestyle and preferences.'
			/>

			<Suspense fallback={<p>Loading...</p>}>
				<InventoryFilters />
			</Suspense>

			<InventorySection Cars={sorted} />
		</>
	)
}
