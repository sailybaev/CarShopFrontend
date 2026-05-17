'use client'

import { useCart } from '@/app/context/cartProvider'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/cars'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface CartProps {
	onClose: () => void
}
export default function Cart({ onClose }: CartProps) {
	const { items, removeFromCart } = useCart()
	console.log(items)
	return createPortal(
		<>
			<section className='fixed top-0 right-0 h-full w-auto bg-white z-50 p-6 overflow-y-auto'>
				<header className='flex items-center justify-between  border-b border-border px-10 py-8'>
					<div className='flex items-center gap-5'>
						<ShoppingBag className='h-8 w-8' />
						<h2 className='uppercase font-bold text-md'>Saved cars</h2>
						<div className='bg-gray-500 px-3 py-1 text-white'>
							{items.length}
						</div>
					</div>
					<Button onClick={onClose}>
						<X className='hover:text-gray-500 h-8 w-8' />
					</Button>
				</header>
				{items.length > 0 ? (
					<section>
						<div className='felx flex-col gap-6'>
							{items.map(car => (
								<div key={car.id} className='flex gap-4 mb-6'>
									<Image
										src={car.image}
										alt={car.brand}
										width={160}
										height={100}
									/>
									<div>
										<p className='text-xs font-semibold uppercase text-muted-foreground'>
											{car.brand}
										</p>
										<h4 className='mt-2 text-xl font-bold'>{car.name}</h4>
										<p className='mt-2 text-sm text-muted-foreground'>
											{car.year}
										</p>
										<h4 className='mt-2 text-xl font-bold'>
											{formatPrice(car.price)}
										</h4>
									</div>

									<span>
										<Button type='button' variant='ghost' className='hover:text-red-500' onClick={()=>removeFromCart(car.id)}>
											<Trash2 />
											Remove
										</Button>
									</span>
								</div>
							))}
						</div>
					</section>
				) : (
					<section className='px-8 py-20'>
						<div className='flex h-full flex-col items-center justify-center px-8 text-center'>
							<ShoppingBag className='text-gray-600' />
							<h5 className='mt-2 text-4xl font-bold'>No saved cars yet</h5>
							<p className='text-sm text-muted-foreground mt-4'>
								Browse our inventory and save cars you're interested in.
							</p>
							<Button variant='ghost' className='hover:bg-accent mt-4'>
								<Link href='/inventory'>Browse Inventory</Link>
							</Button>
						</div>
					</section>
				)}
			</section>
		</>,
		document.body
	)
}
