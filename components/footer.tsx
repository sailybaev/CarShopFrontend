import Link from 'next/link'

const footerLinks = {
	navigation: [
		{ href: '/', label: 'Home' },
		{ href: '/inventory', label: 'Cars' },
		{ href: '/contact', label: 'Contact' }
	],
	services: [
		{ href: '/seller/listings/new', label: 'Sell your car' },
		// TODO: replace with actual test-drive page when created
		{ href: '#', label: 'Book a test drive' },
		// TODO: replace with actual AI assistant page when created
		{ href: '#', label: 'AI assistant' }
	]
}
export default function Footer() {
	return (
		<footer className='bg-tesla-black border-t border-white/10 text-white'>
			<div className='mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24'>
				<div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4'>
					<div className='sm:col-span-2'>
						<Link href='/' className='text-xl font-bold uppercase tracking-[0.18em]'>
							CarHub
						</Link>
						<p className='mt-5 max-w-sm text-sm leading-relaxed text-white/60'>
							Premium auto experience.
							<br />
							Exceptional vehicles. Unmatched service.
						</p>
					</div>
					<div className='text-xs font-bold uppercase tracking-widest text-white/40'>
						<h3>Navigation</h3>
						<ul className='mt-6 flex flex-col gap-3'>
							{footerLinks.navigation.map(x => (
								<li key={x.label}>
									<Link
										className='text-sm font-medium normal-case tracking-normal text-white/60 hover:text-white transition-colors'
										href={x.href}
									>
										{x.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className='text-xs font-bold uppercase tracking-widest text-white/40'>
						<h3>Services</h3>
						<ul className='mt-6 flex flex-col gap-3'>
							{footerLinks.services.map(x => (
								<li key={x.label}> 
									<Link
										className='text-sm font-medium normal-case tracking-normal text-white/60 hover:text-white transition-colors'
										href={x.href}
									>
										{x.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className='mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row'>
					<p className='text-xs text-white/40'>© {new Date().getFullYear()} CarHub. All rights reserved.</p>
					<div className='flex gap-6'>
						<Link href='/about' className='text-xs text-white/40 hover:text-white transition-colors'>About</Link>
						<Link href='/contact' className='text-xs text-white/40 hover:text-white transition-colors'>Contact</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
