'use client'

import { Car } from '@/lib/cars'

import { createContext, use, useContext, useEffect, useState } from 'react'

export type CartItem = Car ;

interface CartContextType {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: number) => void;
	clearCart: () => void;
	isInCart: (id: number) => boolean;
	totalPrice: number;
}

export const CartContext = createContext<CartContextType|null>(null);
export default function CartProvider({children}: {children: React.ReactNode}) {
	const [items, setItems] = useState<CartItem[]>([])
	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			setItems(JSON.parse(storedCart));
		}
	}, []);
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(items));
	}, [items])

	function addToCart(item: CartItem) {
		if(!items.find(i => i.id === item.id)) 
		  setItems(prevItems => [...prevItems, item]);
	}	
	function removeFromCart(id: number){
		setItems(prevItems => prevItems.filter(item => item.id !== id.toString()));
	}
	function clearCart(){
		setItems([])
	}
	function isInCart(id:number):boolean{
		return items.some(i => i.id === id.toString())
	}
	const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  return(
    <CartContext.Provider value={{items, addToCart, removeFromCart, clearCart, isInCart, totalPrice}}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
	const context = useContext(CartContext)
	if(!context)
		{throw new Error('403')}
  return context
}