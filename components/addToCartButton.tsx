'use client'

import { useCart } from '@/app/context/cartProvider'
import { Car } from '@/lib/cars'
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
	const { addToCart, removeFromCart, isInCart } = useCart()
	function handleClick(e: React.MouseEvent) {
		e.preventDefault()
		if (isInCart(Number(car.id))) {
			removeFromCart(Number(car.id))
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
		<Button onClick = {handleClick}>
			{isInCart(Number(car.id)) ? (
				<>
					<Check />
					<p>Added</p>
				</>
			) : (
				<>
					<ShoppingBag />
					<p>Add ro Cart</p>
				</>
			)}
		</Button>
	)
}
