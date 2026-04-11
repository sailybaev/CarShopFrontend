import { Car } from '@/lib/cars'
import Link from 'next/link'
import CarCard from '../carCard'
import { Button } from '../ui/button'

interface recomendationProps {
	cars: Car[]
}

export default function RecomendationSection({ cars }: recomendationProps) {
	return (
		<section className='px-8 py-20'>
			<div className='container mx-auto'>
				<div className='flex justify-between mb-20 '>
					<div>
						<h2 className='text-lg uppercase font-bold'>Recommended Cars</h2>
						<p>We picked top cars for you</p>
					</div>
					<Link href='/inventory'>
						<Button className='hover:bg-primary/80 transition-colors'>
							{' '}
							View Catalog{' '}
						</Button>
					</Link>
				</div>
				<div className='grid grid-cols-3 gap-10'>
					{cars.map(car => (
						<CarCard car={car} key={car.id} />
					))}
				</div>
			</div>
		</section>
	)
}
