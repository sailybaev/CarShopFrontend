'use client'
import FadeIn from '@/components/animations/FadeIn'
import { Car } from '@/lib/cars'
import { useState } from 'react'
import CarCard from '../carCard'
import { Button } from '../ui/button'

interface props {
	Cars: Car[]
}
export default function InventorySection({ Cars }: props) {
	const [visibleCount, setVisibleCount] = useState(3)
	const visibleCars = Cars.slice(0, visibleCount)
	const hasMore = visibleCount < Cars.length

	return (
		<section className='bg-background px-6 py-16 md:px-12 md:py-24'>
			<div className='mx-auto max-w-7xl'>
				<FadeIn>
					<p className='mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
						Showing {visibleCars.length} of {Cars.length} vehicles
					</p>
				</FadeIn>
				<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{visibleCars.map((car, index) => (
						<FadeIn key={car.id} delay={index * 0.2}>
							<CarCard car={car} />
						</FadeIn>
					))}
				</div>
				{hasMore && (
					<FadeIn className='mt-16 flex justify-center'>
						<Button
							size='lg'
							className='h-14 px-12'
							type='button'
							onClick={() => setVisibleCount(prev => prev + 6)}
						>
							View More
						</Button>
					</FadeIn>
				)}
			</div>
		</section>
	)
}
