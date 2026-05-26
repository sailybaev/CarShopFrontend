import { Car } from '@/lib/cars'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './addToCartButton'
import { Button } from './ui/button'

interface props {
	car: Car
}

export default function CarCard({ car }: props) {
	return (
		<Link href={`/inventory/${car.id}`} className='group'>
			<div className='relative aspect-4/3 overflow-hidden bg-muted'>
				{car.image && (
					<Image
						src={car.image}
						alt={car.brand}
						fill
						className='object-cover transition-transform duration-700 group-hover:scale-105'
					/>
				)}
				<div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
				{car.featured && (
					<div className='absolute left-0 top-3 md:top-5 bg-popover px-1  md:px-4 md:py-1.5 text-xs md:text-lg'>
						Featured
					</div>
				)}
				<div className='absolute bottom-5 right-5 text-white text-xs sm:text-lg'>
					{car.year}
				</div>
			</div>
			<div className='border border-t-0 border-border p-2 sm:p-6 pb-0'>
				<p className='font-bold uppercase text-muted-foreground text-xs'>
					{car.brand}
				</p>
				<h3 className='min-h-12 mt-2 text-sm sm:text-lg font-bold leading-tight'>{car.name}</h3>
				<p className='text-xs text-muted-foreground mt-2'>
					{car.mileage}
					<span className='mx-2 opacity-40'>.</span>
					{car.transmission}
					<span className='mx-2 opacity-40'>.</span>
					{car.fuelType}
				</p>
				<div className='mt-5 border-t border-border py-2'>
					<div className='flex flex-col gap-3'>
					<p className='text-md sm:text-2xl font-bold '>{car.price}$</p></div>
					<div className=' mt-2 flex flex-col sm:flex-row w-full gap-1'>
						<Button variant='outline' className='w-full sm:flex-1 text-xs sm:text-md'>
							Buy
						</Button>
						<AddToCartButton variant='icon' car={car} />
					</div>
				</div>
			</div>
		</Link>
	)
}
