'use client'

import {motion}  from 'motion/react'
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

			<div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30' />
		</div>

			<motion.div
				className='container relative z-10 mx-auto px-6 md:px-12'
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className='max-w-3xl text-center md:text-left pt-16'>
					<p className='text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/80'>
						Premium auto experience
					</p>

					<h1 className='mt-5 text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight'>
						Exceptional vehicles.
						<br />
						Unmatched service.
					</h1>

					<div className='mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4'>
						<Button
							size='lg'
							className='h-14 px-10 bg-white text-black hover:bg-white/90 w-full sm:w-auto'
							asChild
						>
							<Link href='/inventory'>
								Explore Inventory
							</Link>
						</Button>

						<Button
							size='lg'
							variant='outline'
							className='h-14 px-10 border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white w-full sm:w-auto'
							asChild
						>
							<Link href='/contact'>
								Book a Call
							</Link>
						</Button>
					</div>
				</div>
			</motion.div>
		</section>
	)
}
