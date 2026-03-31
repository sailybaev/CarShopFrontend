import Link from 'next/link'
import { Button } from '../ui/button'

export default function HeroSection() {
	return (
		<section className='relative flex h-screen items-center overflow-hidden'>
			<div className='absolute inset-0'>
				<video
					autoPlay
					loop
					muted
					playsInline
					className='h-full w-full object-cover'
				>
					<source src='/videoback.mp4' type='video/mp4' />
				</video>

				<div className='absolute inset-0 bg-black/50 ' />
			</div>

			<div className='container relative z-10 mx-auto px-8 '>
				<div className='max-w-full'>
					<p className='text-lg font-semibold uppercase text-primary-foreground'>
						Premium auto experience
					</p>

					<h1 className='mt-5 text-5xl font-bold text-primary-foreground uppercase'>
						Exceptional vehicles.
						<br />
						Unmatched service.
					</h1>

					<div className='mt-8 flex items-center gap-6 '>
						<Button size='lg' variant='secondary' className='h-14 px-10 text-sm font-semibold uppercase' asChild>
							<Link href='/inventory' className='px-8 text-sm font-semibold uppercase'>
								Explore Our Inventory
							</Link>
						</Button>

						<Button size='lg' variant='ghost' className='h-14 px-10 text-sm font-semibold uppercase text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground' asChild> 
							<Link href='/contact' className='px-8 text-sm font-semibold uppercase'>
								Book a Call
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
