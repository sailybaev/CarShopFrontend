import InventoryHeader from '@/components/inventoryHeader'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
	title: 'About Us - CarShop',
	description:
		'Learn more about CarShop, our mission, and our commitment to providing the best car buying experience.'
}

export default function About() {
	return (
		<section className='min-h-screen bg-secondary text-secondary-foreground '>
			<InventoryHeader
				text1='About Us'
				text2='Learn more about CarShop'
				text3='At CarShop, we are passionate about connecting car enthusiasts with their dream vehicles. Our mission is to provide a seamless and enjoyable car buying experience, offering a wide selection of high-quality cars at competitive prices. '
			/>
			{/* You can add more content here about your company, team, values, etc. */}
			<div className='mt-10 text-center max-w-2xl mx-auto'>
				<h3 className='text-2xl font-bold mb-4'>Our Mission</h3>
				<p className='text-muted-foreground'>At CarShop, our mission</p>
			</div>
			<section className='px-8 py-20 pt-10'>
				<div className='mx-auto'>
					<div className=' md:grid grid-cols-2 items-center gap-20'>
						<div className='relative aspect-4/3 overflow-hidden bg-muted'>
							<Image
								src='/carabout.jpg'
								alt='About CarShop'
								fill
								className='hover:scale-105 transition-transform duration-700 object-cover'
							/>
						</div>
						<div>
							<p className='text-sm uppercase font-semibold text-muted-foreground mt-10'>
								Our story
							</p>
							<h2 className='mt-2  text-xl sm:text-4xl font-bold tracking-tight'>
								Redifined Car Buying Experience
							</h2>
							<div className='mt-2 h-px w-full bg-accent'></div>
							<div className='mt-10 space-y-6 text-muted-foreground text-md sm:text-lg'>
								<p>
									Founded in 2024, CarShop was born out of a desire to
									revolutionize the way people buy cars. We understand that
									purchasing a car can be a daunting and stressful experience,
									which is why we set out to create a platform that puts the
									customer first.
								</p>
								<p>
									At CarShop, we believe that buying a car should be an exciting
									and rewarding experience. We are committed to building lasting
									relationships with our customers and being a trusted partner
									in their car buying journey.
								</p>
								<p>
									Thank you for choosing CarShop. We look forward to helping you
									find your dream car and making your car buying experience
									unforgettable.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className='px-8 py-10 bg-primary text-white'>
				<div className='mx-auto flex justify-between'>
					<h2>Ready to visit us?</h2>
					<Button
						variant='ghost'
						className='px-8 text-sm font-semibold uppercase text-white hover:bg-white/10 hover:text-white'
						asChild
					>
						<Link href='/inventory'>Visit Our Store </Link>
					</Button>
				</div>
			</section>
		</section>
	)
}
