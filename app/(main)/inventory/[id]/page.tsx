'use client'

import AddToCartButton from '@/components/addToCartButton'
import CarCard from '@/components/carCard'
import FadeIn from '@/components/animations/FadeIn'
import MessageSellerButton from '@/components/messageSellerButton'
import { Button } from '@/components/ui/button'
import { fetchListing, fetchListingById } from '@/lib/api'
import { formatPrice } from '@/lib/cars'
import { useQuery } from '@tanstack/react-query'
import {
	ArrowLeft,
	ArrowRight,
	ArrowUp10,
	Calendar,
	Fuel,
	Gauge
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'




export default  function CarDetail() {
	const param = useParams()
	const  id  =  param.id as string
	const {
		data: car,
		isPending: isCarPending,
		isLoading: isCarLoading
	} = useQuery({
		queryKey: ['car', id],
		queryFn: () => fetchListingById(id)
	})

	// if (!car) return (<p>Car not found</p>)
		
	// const {
	// 	data: cars = [],
	// 	isPending: isCarsPending,
	// 	isLoading: isCarsLoading
	// } = useQuery({
	// 	queryKey: ['cars'],
	// 	queryFn: fetchListing
	// })
	const {
		data: cars = [],
		isLoading: isCarsLoading
	} = useQuery({
		queryKey: ['cars'],
		queryFn: fetchListing
	})

	if (isCarPending || isCarLoading || isCarsLoading) return (<p className="px-6 py-20">Loading...</p>)
	if (!car) return (<p className="px-6 py-20">Car not found</p>)

	const related = cars.filter(item => item.id !== car.id).slice(0, 3)
	const values = {
		year: String(car.year),
		mileage: car.mileage,
		transmission: car.transmission,
		fuelType: car.fuelType
	}
	const specs = [
		{
			icon: Calendar,
			label: 'Year',
			key: 'year' as const
		},
		{
			icon: Gauge,
			label: 'Mileage',
			key: 'mileage' as const
		},
		{
			icon: ArrowUp10,
			label: 'Transmission',
			key: 'transmission' as const
		},
		{
			icon: Fuel,
			label: 'Fuel Type',
			key: 'fuelType' as const
		}
	]
	
	return (
		<section className='min-h-screen bg-background text-foreground'>
			<div className='border-b border-border px-6 pt-20 pb-4 md:px-12 md:pt-24'>
				<div className='mx-auto max-w-7xl'>
					<FadeIn trigger='mount'>
						<Link href='/inventory' className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors'>
							<ArrowLeft className='h-4 w-4' />
							All Vehicles
						</Link>
					</FadeIn>
				</div>
			</div>

			<section className='px-6 py-12 md:px-12 md:py-20'>
				<div className='mx-auto max-w-7xl'>
					<div className='grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16'>
						<div className='lg:col-span-3'>
							<FadeIn>
								<div className='relative aspect-[4/3] overflow-hidden bg-muted'>
									{car.image ? (
									<Image
										src={car.image}
										alt={`${car.brand} ${car.name}`}
										fill
										className='object-cover'
									/>
								) : (
									<div className='flex h-full w-full items-center justify-center bg-secondary text-muted-foreground'>
										No image
									</div>
								)}
									{car.featured && (
										<div className='absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black md:left-4 md:top-4 md:px-3 md:py-1.5'>
											Featured
										</div>
									)}
								</div>
							</FadeIn>
						</div>

						<div className='lg:col-span-2 lg:sticky lg:top-24 lg:self-start'>
							<FadeIn delay={0.2}>
								<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
									{car.brand}
								</p>
								<h1 className='mt-2 text-3xl font-bold uppercase tracking-tight md:text-4xl'>{car.name}</h1>
								<p className='mt-2 text-sm text-muted-foreground'>{car.year}</p>
								<div className='mt-6 border-t border-border pt-6'>
									<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
										Asking Price
									</p>
									<p className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
										{formatPrice(car.price)}
									</p>
									<div className='grid grid-cols-2 mt-6 gap-px bg-border border border-border'>
										{specs.map(({ icon: Icon, label, key }) => (
											<div className='bg-secondary px-5 py-5' key={label}>
												<div className='flex items-center gap-2 text-muted-foreground'>
													<Icon className='h-4 w-4' />
													<p className='text-[10px] font-bold uppercase tracking-wider'>
														{label}
													</p>
												</div>
												<p className='mt-2 text-sm font-semibold'>{values[key]}</p>
											</div>
										))}
									</div>
									<div className='flex flex-col gap-3 mt-6'>
										<Button size='lg' className='h-14 w-full'>
											Inquire about this vehicle
										</Button>
										<Button size='lg' variant='outline' className='h-14 w-full'>
											Schedule a test drive
										</Button>
										<AddToCartButton car={car} />

										<MessageSellerButton
											listingId={car.id}
											sellerId={car.sellerId}
											listingTitle={`${car.brand} ${car.name}`}
											listingImage={car.image}
										/>
									</div>
									<p className='mt-4 text-center text-xs text-muted-foreground'>
										No obligation * Respond within 24 hours
									</p>
								</div>
							</FadeIn>
						</div>
							<div className='col-span-1 lg:col-span-5'>
								<div className='border-b border-border mt-8 flex items-end justify-between pb-4'>
									<div>
										<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
											Explore more
										</p>
										<h3 className='mt-1 text-xl font-bold md:text-2xl'>Similar Vehicles</h3>
									</div>
									<Link
										href='/inventory'
										className='inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors'
									>
										view all
										<ArrowRight className='h-4 w-4' />
									</Link>
								</div>
								{related.length > 0 ? (
									<div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
										{related.map(item => (
											<CarCard car={item} key={item.id} />
										))}
									</div>
								) : (
									<div className='mt-8 flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-secondary py-16 text-center'>
										<p className='text-sm text-muted-foreground'>
											No similar vehicles available right now.
										</p>
										<Button className='mt-4' asChild>
											<Link href='/inventory'>Browse Inventory</Link>
										</Button>
									</div>
								)}
							</div>
					</div>
				</div>
			</section>
		</section>
	)
}
