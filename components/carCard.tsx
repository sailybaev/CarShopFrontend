import { Car } from '@/lib/cars'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

interface props {
	car: Car
}

export default function CarCard({ car }: props) {
	return (
		<Link href={`/inventory/${car.id}`} className='group'>
			<div className='relative aspect-4/3 overflow-hidden bg-muted'>
				<Image
					src={car.image}
					alt={car.brand}
					fill
					className='object-cover transition-transform duration-700 group-hover:scale-105'
				/>
				<div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
				{car.featured && (
					<div className='absolute left-0 top-5 bg-accent px-4 py-1.5'>
						Featured
					</div>
				)}
				<div className='absolute bottom-5 right-5 text-white'>{car.year}</div>
			</div>
			<div className='border border-t-0 border-border p-6 pb-0'>
				<p className='font-bold uppercase text-muted-foreground text-xs'>
					{car.brand}
				</p>
				<h3 className='mt-2 text-xl font-bold'>{car.name}</h3>
				<p className='text-xs text-muted-foreground mt-2'>
					{car.mileage}
					<span className='mx-2 opacity-40'>.</span>
					{car.transmission}
					<span className='mx-2 opacity-40'>.</span>
					{car.fuelType}
				</p>
				<div className='mt-5 flex justify-between items-center border-t border-border p-5'>
					<p className='text-2xl font-bold'>{car.price}$</p>
					<Button variant='outline' className='px-8'>
						Buy
					</Button>
				</div>
			</div>
		</Link>
	)
}
