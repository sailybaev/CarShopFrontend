'use client'

import { Car } from '@/lib/cars'
import { useCartStore } from '@/store/cartStore'
import { Check, ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'

interface AddToCartButtonProps {
	variant?: 'full' | 'icon'
	car: Car
}

export default function AddToCartButton({
	variant = 'full',
	car
}: AddToCartButtonProps) {
	const addToCart = useCartStore(x => x.addToCart)
	const removeFromCart = useCartStore(x => x.removeFromCart)
  const isInCart = useCartStore(x=>x.isInCart)
	
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
			<Button onClick={handleClick}>
				{isInCart(Number(car.id)) ? <Check /> : <ShoppingBag />}
			</Button>
		)
	}
	return (
		<Button onClick={handleClick}>
			{isInCart(Number(car.id)) ? (
				<>
					<Check />
					<p>Added</p>
				</>
			) : (
				<>
					<ShoppingBag />
					<p>Add to Cart</p>
				</>
			)}
		</Button>
	)
}
