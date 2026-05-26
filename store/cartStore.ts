import { Car } from '@/lib/cars'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = Car

interface CartContextType {
	items: CartItem[]
	addToCart: (item: CartItem) => void
	removeFromCart: (id: string) => void
	clearCart: () => void
	isInCart: (id: number) => boolean
	totalPrice: number
}
export const useCartStore = create<CartContextType>()(
	persist(
		(set, get) => ({
			items: [],
			addToCart(item) {
				const allreadyInCart = get().items.some(x => x.id === item.id)
				if (allreadyInCart) return
				set(prevItems => ({ items: [...prevItems.items, item] }))
			},
			removeFromCart(id) {
				set(state => ({ items: state.items.filter(x => x.id !== id) }))
			},
			clearCart() {
				set({ items: [] })
			},
			isInCart(id) {
				return get().items.some(x => x.id === id.toString())
			},
			get totalPrice() {
				return get().items.reduce((sum, item) => sum + item.price, 0)
			}
		}),
		{ name: 'cart' }
	)
)
