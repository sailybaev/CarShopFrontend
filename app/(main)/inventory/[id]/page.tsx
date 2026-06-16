import AddToCartButton from '@/components/addToCartButton'
import CarCard from '@/components/carCard'
import MessageSellerButton from '@/components/messageSellerButton'
import { Button } from '@/components/ui/button'
import { fetchListing, fetchListingById } from '@/lib/api'
import { formatPrice } from '@/lib/cars'
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
import { notFound } from 'next/navigation'

interface props {
	params: Promise<{ id: string }>
}
export default async function CarDetail({ params }: props) {
	const { id } = await params
	const car = await fetchListingById(id)

	if (!car) notFound()

	const cars = await fetchListing()
	const related = cars.filter(Car => Car.id !== car.id).slice(0, 3)
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
		<section className='min-h-screen bg-secondary text-secondary-foreground'>
			<div className='border-b border-border px-8 py-4'>
				<div className='uppercase text-xs font-semibold'>
					<Link href='/inventory' className='inline-flex items-center gap-2'>
						<ArrowLeft className='h-3.5 w-3.5' />
						All Vehicles
					</Link>
				</div>
			</div>

			<section className='px-8 py-20'>
				<div className='mx-auto'>
					<div className='grid grid-cols-5 gap-16'>
						<div className='col-span-3'>
							<div className='relative aspect-4/3 overflow-hidden bg-muted'>
								<Image
									src={car.image}
									alt={car.brand}
									fill
									className='object-cover'
								/>
								{car.featured && (
									<div className='absolute left-0 top-5 bg-secondary px-4 py-1.5'>
										Featured
									</div>
								)}
							</div>
						</div>

						<div className='col-span-2 sticky'>
							<p className='text-xs font-semibold uppercase text-muted-foreground'>
								{car.brand}
							</p>
							<h1 className='mt-2 text-4xl font-bold'>{car.name}</h1>
							<p className='mt-2 text-sm text-muted-foreground'>{car.year}</p>
							<div className='mt-6 border-t border-border pt-8'>
								<p className='text-xs font-semibold uppercase text-muted-foreground'>
									Asking Price
								</p>
								<h1 className='mt-2 text-4xl font-bold'>
									{formatPrice(car.price)}
								</h1>
								<div className='grid grid-cols-2 mt-8 gap-px bg-border'>
									{specs.map(({ icon: Icon, label, key }) => (
										<div className='bg-secondary px-6 py-5' key={label}>
											<div className='flex items-center gap-2 text-muted-foreground'>
												<Icon className='h-3.5 w-3.5' />
												<p className='text-xs font-semibold uppercase'>
													{label}
												</p>
											</div>
											<p className='mt-2 font-semibold'>{values[key]}</p>
										</div>
									))}
								</div>
								<div className='flex flex-col gap-3 mt-8'>
									<Button
										size='lg'
										className='h-14 w-full tex-sm font-semibold uppercase'
									>
										Inquire about this vehicle
									</Button>
									<Button
										size='lg'
										className='h-14 w-full tex-sm font-semibold uppercase'
										variant={'outline'}
									>
										schedule a test drive
									</Button>
									<AddToCartButton car={car} />

									<MessageSellerButton
										listingId={car.id}
										sellerId={car.sellerId}
										listingTitle={`${car.brand} ${car.name}`}
										listingImage={car.image}
									/>

									<p className='text-xs text-muted-foreground text-center'>
										No obligation * Respond within 24 hours
									</p>
								</div>
							</div>
						</div>
						<div className='mt-10 col-span-5'>
							<div className='border-b border-border mt-4 flex items-end justify-between'>
								<div className='mb-3'>
									<p className='font-semibold uppercase text-muted-foreground text-xs'>
										Explore more
									</p>
									<h3 className='font-bold text-xl'>Similar Vehicles</h3>
								</div>
								<div className='mb-4'>
									<Link
										href='/inventory'
										className='font-semibold uppercase text-xs text-muted-foreground items-center flex gap-1'
									>
										view all
										<ArrowRight className='h-3.5 w-3.5' />
									</Link>
								</div>
							</div>
							<div className='mt-6 grid grid-cols-3 gap-6'>
								{related.map(car => (
									<CarCard car={car} key={car.id} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</section>
	)
}
