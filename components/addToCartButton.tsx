'use client'

import { Car } from '@/lib/cars'
import { useCartStore } from '@/store/cartStore'
import { Check, ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'

interface AddToCartButtonProps {
	variant?: 'full' | 'icon'
	car: Car
	className?: string
}

export default function AddToCartButton({
	variant = 'full',
	car,
	className
}: AddToCartButtonProps) {
	const addToCart = useCartStore(x => x.addToCart)
	const removeFromCart = useCartStore(x => x.removeFromCart)
	const isInCart = useCartStore(x => x.isInCart)

	function handleClick(e: React.MouseEvent) {
		e.preventDefault()
		if (isInCart(Number(car.id))) {
			removeFromCart(car.id)
		} else {
			addToCart(car)
		}
	}

	if (variant === 'icon') {
		return (
			<Button
				size='icon'
				variant='outline'
				className={className}
				onClick={handleClick}
			>
				{isInCart(Number(car.id)) ? <Check /> : <ShoppingBag />}
			</Button>
		)
	}

	return (
		<Button
			size='lg'
			variant='outline'
			className={`h-14 w-full ${className ?? ''}`}
			onClick={handleClick}
		>
			{isInCart(Number(car.id)) ? (
				<>
					<Check />
					<span>Added</span>
				</>
			) : (
				<>
					<ShoppingBag />
					<span>Add to Cart</span>
				</>
			)}
		</Button>
	)
}
