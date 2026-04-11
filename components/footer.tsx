import Link from 'next/link'

const footerLinks = {
	navigation: [
		{ href: '/', label: 'Home Page' },
		{ href: '/newcars', label: 'New Cars' },
		{ href: '/pre-ownedcars', label: 'Pre-Owned Cars' },
		{ href: '/credit', label: 'Credit' }
	],
	services: [
		{ href: '/', label: 'Home Page' },
		{ href: '/newcars', label: 'New Cars' },
		{ href: '/pre-ownedcars', label: 'Pre-Owned Cars' },
		{ href: '/credit', label: 'Credit' }
	]
}
export default function Footer() {
	return (
		<footer className='bg-primary border-t border-border text-primary-foreground'>
			<div className='mx-auto px-8 py-20 '>
				<div className='grid grid-cols-4 gap-8'>
					<div className='col-span-2'>
						<Link href='/' className='uppercase font-semibold '>CarHub</Link>
						<p className='mt-3'>
							Premium auto experience
							<br />
							Exceptional vehicles.
							<br />
							Unmatched service.
						</p>
					</div>
					<div className='font-bold uppercase text-primary-foreground/40'>
						<h3>Navigation</h3>
						<ul className='mt-5'>
							{footerLinks.navigation.map(x => (
								<li key={x.label}>
									<Link
										className='text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors'
										href={x.href}
									>
										{x.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className='font-bold uppercase text-primary-foreground/40'>
						<h3>Services</h3>
						<ul className='mt-5'>
							{footerLinks.services.map(x => (
								<li key={x.label}> 
									<Link
										className='text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors'
										href={x.href}
									>
										{x.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	)
}
