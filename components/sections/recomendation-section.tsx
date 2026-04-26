'use client'

import { Car } from '@/lib/cars'
import { motion } from 'motion/react'
import Link from 'next/link'
import CarCard from '../carCard'
import { Button } from '../ui/button'

interface recomendationProps {
	cars: Car[]
}

export default function RecomendationSection({ cars }: recomendationProps) {
	return (
		<section className='px-8 py-20 bg-secondary text-secondary-foreground'>
			<div className='container mx-auto'>
				<motion.div
					className='flex justify-between mb-20 '
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true, amount: 0.2 }}
				>
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
				</motion.div>
				<div className='grid grid-cols-3 gap-10'>
					{cars.map((car, index) => (
						<motion.div
							key={car.id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration:0.8, delay: index * 0.2 }}
							viewport={{ once: true, amount: 0.2 }}
						>
							<CarCard car={car} key={car.id} />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
