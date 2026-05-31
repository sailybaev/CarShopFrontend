'use client'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/cars'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface CartProps {
	onClose: () => void
}
export default function Cart({ onClose }: CartProps) {
	const items = useCartStore(t => t.items)
	const removeFromCart = useCartStore(t => t.removeFromCart)
	const totalPrice = useCartStore(t => t.totalPrice)

	console.log(items)
	return createPortal(
		<div className='fixed inset-0 z-50 flex justify-end'>
			<div className='absolute inset-0 bg-black/40' onClick={onClose} />
			<section className='relative z-10 h-full w-full max-w-120 bg-white p-6 overflow-y-auto'>
				<header className='flex items-center justify-between  border-b border-border px-6 py-5'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
							<ShoppingBag className='h-6 w-6' />
						</div>
						<div>
							<h2 className='uppercase font-bold text-md tracking-wide'>
								Saved cars
							</h2>
							<p className='text-sm text-muted-foreground'>
								{items.length} {items.length === 1 ? 'vehicle' : 'vehicles'}{' '}
								saved
							</p>
						</div>
					</div>
					<Button onClick={onClose} className='h-11 w-11 rounded-full'>
						<X />
					</Button>
				</header>
				{items.length > 0 ? (
					<section className='p-6'>
						<div className='flex flex-col gap-6'>
							{items.map(car => (
								<div
									key={car.id}
									className='flex flex-col gap-4 pb-6 border-b '
								>
									<div className='flex gap-4 items-center'>
										<Image
											src={car.image}
											alt={car.brand}
											width={160}
											height={100}
											className='w-full sm:w-45 h-auto object-cover'
										/>
										<div className='flex-1'>
											<p className='text-xs font-semibold uppercase text-muted-foreground'>
												{car.brand}
											</p>
											<h4 className=' text-lg font-bold'>{car.name}</h4>
											<p className=' text-sm text-muted-foreground'>
												{car.year}
											</p>
											<h4 className='text-lg font-bold'>
												{formatPrice(car.price)}
											</h4>
										</div>
									</div>

									<Button
										type='button'
										variant='default'
										className='hover:text-red-500 mt-4'
										onClick={() => removeFromCart(car.id)}
									>
										<Trash2 />
										Remove
									</Button>
								</div>
							))}
							{/* <hr className='my-4'/> */}
							<div className='flex justify-between mt-4 font-bold text-lg'>
								<p>Total price:</p>
								<p>{formatPrice(totalPrice)}</p>
							</div>
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
							<Button
								variant='ghost'
								className='hover:bg-accent mt-4'
								onClick={onClose}
							>
								<Link href='/inventory'>Browse Inventory</Link>
							</Button>
						</div>
					</section>
				)}
			</section>
		</div>,
		document.body
	)
}
