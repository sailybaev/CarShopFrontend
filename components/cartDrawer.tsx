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

	return createPortal(
		<div className='fixed inset-0 z-50 flex justify-end'>
			<div className='absolute inset-0 bg-black/60' onClick={onClose} />
			<section className='relative z-10 h-full w-full max-w-md bg-background p-0 overflow-y-auto shadow-2xl'>
				<header className='flex items-center justify-between border-b border-border px-6 py-5'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center bg-secondary text-foreground'>
							<ShoppingBag className='h-6 w-6' />
						</div>
						<div>
							<h2 className='text-xs font-bold uppercase tracking-[0.15em]'>
								Saved cars
							</h2>
							<p className='text-sm text-muted-foreground'>
								{items.length} {items.length === 1 ? 'vehicle' : 'vehicles'} saved
							</p>
						</div>
					</div>
					<Button onClick={onClose} variant='ghost' size='icon' className='h-10 w-10'>
						<X />
					</Button>
				</header>
				{items.length > 0 ? (
					<section className='p-6'>
						<div className='flex flex-col gap-6'>
							{items.map(car => (
								<div
									key={car.id}
									className='flex flex-col gap-4 pb-6 border-b border-border'
								>
									<div className='flex gap-4 items-start'>
										{car.image ? (
											<Image
												src={car.image}
												alt={car.brand}
												width={160}
												height={100}
												className='w-32 h-20 object-cover bg-muted'
											/>
										) : (
											<div className='flex w-32 h-20 items-center justify-center bg-secondary text-muted-foreground text-xs'>
												No image
											</div>
										)}
										<div className='flex-1 min-w-0'>
											<p className='text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground'>
												{car.brand}
											</p>
											<h4 className='text-base font-bold truncate'>{car.name}</h4>
											<p className='text-sm text-muted-foreground'>
												{car.year}
											</p>
											<h4 className='text-base font-bold mt-1'>
												{formatPrice(car.price)}
											</h4>
										</div>
									</div>

									<Button
										type='button'
										variant='outline'
										className='w-full text-destructive hover:bg-destructive hover:text-white'
										onClick={() => removeFromCart(car.id)}
									>
										<Trash2 />
										Remove
									</Button>
								</div>
							))}
							<div className='flex justify-between pt-4 font-bold text-lg'>
								<p>Total:</p>
								<p>{formatPrice(totalPrice)}</p>
							</div>
							<Button size='lg' className='w-full h-14'>
								Schedule Test Drive
							</Button>
						</div>
					</section>
				) : (
					<section className='px-8 py-20'>
						<div className='flex h-full flex-col items-center justify-center px-8 text-center'>
							<ShoppingBag className='h-12 w-12 text-muted-foreground' />
							<h5 className='mt-6 text-2xl font-bold'>No saved cars yet</h5>
							<p className='text-sm text-muted-foreground mt-3'>
								Browse our inventory and save cars you are interested in.
							</p>
							<Button
								variant='outline'
								className='mt-8 h-12 px-8'
								onClick={onClose}
								asChild
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
