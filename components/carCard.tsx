import { Car, formatPrice } from '@/lib/cars'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './addToCartButton'
import { Button } from './ui/button'

interface props {
	car: Car
}

export default function CarCard({ car }: props) {
	return (
		<Link href={`/inventory/${car.id}`} className='group flex flex-col'>
			<div className='relative aspect-[4/3] overflow-hidden bg-muted'>
				{car.image ? (
					<Image
						src={car.image}
						alt={`${car.brand} ${car.name}`}
						fill
						className='object-cover transition-transform duration-700 group-hover:scale-105'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center bg-secondary text-muted-foreground'>
						No image
					</div>
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
				{car.featured && (
					<div className='absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black md:left-4 md:top-4 md:px-3 md:py-1.5'>
						Featured
					</div>
				)}
				<div className='absolute bottom-4 right-4 text-xs font-semibold uppercase tracking-wider text-white/90'>
					{car.year}
				</div>
			</div>
			<div className='flex flex-1 flex-col border border-t-0 border-border p-5 md:p-6'>
				<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
					{car.brand}
				</p>
				<h3 className='mt-2 text-lg font-bold leading-tight md:text-xl'>{car.name}</h3>
				<p className='mt-2 text-sm text-muted-foreground'>
					{car.mileage}
					<span className='mx-2 opacity-40'>·</span>
					{car.transmission}
					<span className='mx-2 opacity-40'>·</span>
					{car.fuelType}
				</p>
				<div className='mt-auto pt-5'>
					<div className='flex items-end justify-between border-t border-border pt-4'>
						<p className='text-xl font-bold tracking-tight'>{formatPrice(car.price)}</p>
						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm' className='h-9 px-4'>
								Buy
							</Button>
							<AddToCartButton variant='icon' car={car} />
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}
