import Link from 'next/link'
import { Button } from './ui/button'
const navLinks= [
	{ href: '/' , label:"home"},
	{ href: '/about' , label:"about"},
	{ href: '/contact' , label:"contact"},
	{ href: '/inventory' , label:"inventory"},
]

export function Header() {
	return (
		<header className='sticky top-0 z-50 w-full border-b border-white bg-white'>
			<div className='container mx-auto flex justify-between items-center px-8 h-20'>

				<Link href="/" className='text-2xl font-bold text-gray-800'>
					<span className='text-lg font-bold uppercase'>
						CarHub
					</span>
				</Link>

				<nav className='flex items-center gap-12'>

					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='text-lg font-medium text-gray-800 hover:text-blue-500'
						>
							{link.label}
						</Link>
					))}

				</nav>

				
				<Button>
					<Link href="/contact" className='px-8 text-sm font-semibold uppercase'>
						Book a call
					</Link>
				</Button>
				

			</div>
		</header>
	) 
}