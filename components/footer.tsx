import Link from 'next/link'

const navLinks= [
	{ href: '/' , label:"home"},
	{ href: '/about' , label:"about"},
	{ href: '/contact' , label:"contact"},
	{ href: '/inventory' , label:"inventory"},
]

export function Header() {
	return (
		<header className='sticky top-0 z-50 w-full border-b border-white bg-white/50 backdrop-blur-sm'>
			<div>

				<Link href="/" className='text-2xl font-bold text-gray-800'>
					CarHub
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

				

			</div>
		</header>
	) 
}