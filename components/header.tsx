'use client'

import { useAuth } from '@/app/context/authProvider'
import { useCart } from '@/app/context/cartProvider'
import { ThemeContext } from '@/app/context/themeProvider'
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { useContext, useState } from 'react'
import Cart from './cartDrawer'
import { Button } from './ui/button'
const navLinks = [
	{ href: '/', label: 'home' },
	{ href: '/about', label: 'about' },
	{ href: '/contact', label: 'contact' },
	{ href: '/inventory', label: 'inventory' },
	{ href: '/chats', label: 'chats' }
]

export function Header() {
	const { theme, toggleTheme } = useContext(ThemeContext)
	const { items } = useCart()
	const { user } = useAuth()

	const [isCartOpen, setIsCartOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='sticky top-0 z-50 w-full border-b border-border bg-secondary text-secondary-foreground'>
			<div className='container mx-auto flex justify-between items-center px-4  h-16 md:px-8 md:h-20'>
				<Link href='/' className='text-2xl font-bold'>
					<span className='text-lg font-bold uppercase'>CarHub</span>
				</Link>

				<nav className='md:flex items-center gap-8 hidden ml-2'>
					{!user
						? navLinks
								.filter(link => link.href !== '/chats')
								.map(link => (
									<Link
										key={link.href}
										href={link.href}
										className='text-lg font-medium hover:text-gray-500 transition-colors'
									>
										{link.label}
									</Link>
								))
						: navLinks.map(link => (
								<Link
									key={link.href}
									href={link.href}
									className='text-sm font-medium hover:text-gray-500 transition-colors mr-2'
								>
									{link.label}
								</Link>
							))}
				</nav>
				<div className='flex justify-center'>
					<Button
						variant='secondary'
						className='hover:text-gray-400 transition-colors'
						onClick={() => setIsCartOpen(true)}
					>
						<ShoppingBag /> {items.length}
					</Button>
					{isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
					<Button
						variant='secondary'
						onClick={toggleTheme}
						className='hover:text-gray-400 transition-colors mx-2'
					>
						{theme === 'light' ? <Moon /> : <Sun />}
					</Button>

					<Button className='hover:bg-primary/80 transition-colors hidden md:block'>
						<Link
							href='/contact'
							className='px-8 text-sm font-semibold uppercase '
						>
							Book a call
						</Link>
					</Button>
					<Button
						variant='secondary'
						className='md:hidden'
						onClick={() => setIsMenuOpen(prev => !prev)}
					>
						{isMenuOpen ? <X /> : <Menu />}
					</Button>
				</div>
			</div>
			{isMenuOpen && (
				<nav className='md:hidden py-4 px-8 sm:px-32 flex justify-between flex-col border-t border-border bg-secondary'>
					<div className='flex flex-row sm:px-32 justify-between'>
						{!user
							? navLinks
									.filter(link => link.href !== '/chats')
									.map(link => (
										<Link
											key={link.href}
											href={link.href}
											className='text-xs sm:text-lg font-medium hover:text-gray-500 transition-colors'
										>
											{link.label}
										</Link>
									))
							: navLinks.map(link => (
									<Link
										key={link.href}
										href={link.href}
										className='text-sm font-medium hover:text-gray-500 transition-colors mr-2'
									>
										{link.label}
									</Link>
								))}
					</div>
					<Button className='hover:bg-primary/80 transition-colors mt-2'>
						<Link
							href='/contact'
							className='px-8 text-sm font-semibold uppercase '
						>
							Book a call
						</Link>
					</Button>
				</nav>
			)}
		</header>
	)
}
