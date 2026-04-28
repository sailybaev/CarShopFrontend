'use client'

import { useCart } from '@/app/context/cartProvider'
import { ThemeContext } from '@/app/context/themeProvider'
import { Moon, ShoppingBag, Sun } from 'lucide-react'
import Link from 'next/link'
import { useContext, useState } from 'react'
import Cart from './cartDrawer'
import { Button } from './ui/button'
const navLinks = [
	{ href: '/', label: 'home' },
	{ href: '/about', label: 'about' },
	{ href: '/contact', label: 'contact' },
	{ href: '/inventory', label: 'inventory' }
]

export function Header() {
	const { theme, toggleTheme } = useContext(ThemeContext)
	const { items } = useCart()
	const [isOpen, setIsOpen] = useState(false)
	return (
		<header className='sticky top-0 z-50 w-full border-b border-border bg-secondary text-secondary-foreground'>
			<div className='container mx-auto flex justify-between items-center px-8 h-20'>
				<Link href='/' className='text-2xl font-bold'>
					<span className='text-lg font-bold uppercase'>CarHub</span>
				</Link>

				<nav className='flex items-center gap-12'>
					{navLinks.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className='text-lg font-medium hover:text-gray-500 transition-colors'
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className='flex justify-center'>
					<Button
						variant='secondary'
						className='hover:text-gray-400 transition-colors'
						onClick={() => setIsOpen(true)}
					>
						<ShoppingBag /> {items.length}
					</Button>
					{isOpen && <Cart />}
					<Button
						variant='secondary'
						onClick={toggleTheme}
						className='hover:text-gray-400 transition-colors mx-2'
					>
						{theme === 'light' ? <Moon /> : <Sun />}
					</Button>

					<Button className='hover:bg-primary/80 transition-colors'>
						<Link
							href='/contact'
							className='px-8 text-sm font-semibold uppercase '
						>
							Book a call
						</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}
