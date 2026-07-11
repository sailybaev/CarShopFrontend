'use client'

import { ThemeContext } from '@/app/context/themeProvider'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { Menu, Moon, ShoppingBag, Sun, User, X } from 'lucide-react'
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
	const items = useCartStore(t=>t.items)
	const user  = useAuthStore(x=>x.user)

	const [isCartOpen, setIsCartOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors'>
			<div className='container mx-auto flex justify-between items-center px-6 h-16 md:px-12 md:h-20'>
				<Link href='/' className='text-xl font-bold uppercase tracking-[0.18em]'>
					CarHub
				</Link>

				<nav className='md:flex items-center gap-8 hidden'>
					{!user
						? navLinks
								.filter(link => link.href !== '/chats')
								.map(link => (
									<Link
										key={link.href}
										href={link.href}
										className='text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors'
									>
										{link.label}
									</Link>
								))
						: navLinks.map(link => (
									<Link
										key={link.href}
										href={link.href}
										className='text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors'
									>
										{link.label}
									</Link>
								))}
				</nav>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon'
						className='relative text-white/80 hover:bg-white/10 hover:text-white'
						onClick={() => setIsCartOpen(true)}
					>
						<ShoppingBag />
						{items.length > 0 && (
							<span className='absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-none bg-white px-1 text-[10px] font-bold text-black'>
								{items.length}
							</span>
						)}
					</Button>
					{isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
					<Button
						variant='ghost'
						size='icon'
						onClick={toggleTheme}
						className='text-white/80 hover:bg-white/10 hover:text-white'
					>
						{theme === 'light' ? <Moon /> : <Sun />}
					</Button>

					<Button variant='ghost' size='icon' className='text-white/80 hover:bg-white/10 hover:text-white' asChild>
						<Link href='/login'>
							<User />
						</Link>
					</Button>

					<Button className='hidden md:inline-flex h-11 px-6 bg-white text-black hover:bg-white/90' asChild>
						<Link href='/contact'>
							Book a call
						</Link>
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden text-white hover:bg-white/10'
						onClick={() => setIsMenuOpen(prev => !prev)}
					>
						{isMenuOpen ? <X /> : <Menu />}
					</Button>
				</div>
			</div>
			{isMenuOpen && (
				<nav className='md:hidden border-t border-white/10 bg-black/90 px-6 py-6 backdrop-blur-md'>
					<div className='flex flex-col gap-4'>
						{!user
							? navLinks
									.filter(link => link.href !== '/chats')
									.map(link => (
										<Link
											key={link.href}
											href={link.href}
											className='text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors py-2'
										>
											{link.label}
										</Link>
									))
							: navLinks.map(link => (
										<Link
											key={link.href}
											href={link.href}
											className='text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors py-2'
										>
											{link.label}
										</Link>
									))}

						<Button className='mt-4 h-12 w-full bg-white text-black hover:bg-white/90' asChild>
							<Link href='/contact'>
								Book a call
							</Link>
						</Button>
					</div>
				</nav>
			)}
		</header>
	)
}
