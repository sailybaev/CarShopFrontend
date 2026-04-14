import InventoryFilters from '@/components/inventory-filters'
import InventoryHeader from '@/components/inventoryHeader'
import InventorySection from '@/components/sections/inventorySection'
import { Car, cars } from '@/lib/cars'
import { Suspense } from 'react'

export const metadata = {
	title: 'Inventory',
	description: 'Hello'
}

function filterCars(
	allCars: Car[],
	brand: string,
	fuelType: string,
	transmission: string
): Car[] {
	return allCars.filter(car => {
		if (brand !== 'All' && car.brand !== brand) return false
		if (fuelType !== 'All' && car.fuelType !== fuelType) return false
		if (transmission !== 'All' && car.transmission !== transmission)
			return false
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
		case 'mileage-asc':
			sorted.sort((a, b) => a.mileage - b.mileage)
			break
		case 'mileage-desc':
			sorted.sort((a, b) => b.mileage - a.mileage)
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

export default async function InventoryPage({
	searchParams
}: {
	searchParams: Promise<{
		brand?: string
		fuelType?: string
		transmission?: string
		sort?: string
	}>
}) {
	const params = await searchParams

	const brand = params.brand ?? 'All'
	const fuelType = params.fuelType ?? 'All'
	const transmission = params.transmission ?? 'All'
	const sort = params.sort ?? 'price'
	const filtered = filterCars(cars, brand, fuelType, transmission)
	const sorted = sortCars(filtered, sort)

	return (
		<>
			<InventoryHeader
				text1='Our Collection'
				text2='Vehicle Inventory'
				text3='Explore our curated collection of premium vehicles. 
				Find the perfect car tailored to your lifestyle and preferences.'
			/>

			<Suspense fallback={<p>Loading...</p>}>
				<InventoryFilters />
			</Suspense>

			<InventorySection Cars={sorted} />
		</>
	)
}
