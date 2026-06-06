import type { Car } from '@/lib/cars'
import { useCartStore } from '@/store/cartStore'
import {act} from '@testing-library/react'

const testCar :Car = {
	id: '1',
	name: 'T',
	brand: 'Tesla',
	year: 2010,
	price: 150000,
	sellerId: '5'
}
const testCar2 :Car ={
	id: '2',
	name: 'D',
	brand: 'BMW',
	year: 2000,
	price: 90000,
	sellerId: '2'
}
beforeEach(()=>{
	act(()=>{
		useCartStore.setState({items:[]})
	})
})
describe('cartStore-initial state', ()=>{
	it('1test-empty cart',()=>{
		expect(useCartStore.getState().items).toHaveLength(0)
	})
	it('1test-totalPrice 0',()=>{
		expect(useCartStore.getState().totalPrice).toBe(0)
	})
})

describe('addToCart',()=>{
	it('addCar',()=>{
		useCartStore.getState().addToCart(testCar)
		const { items }= useCartStore.getState()
		expect(items[0]).toEqual(testCar)
		expect(items.length).toBe(1)
	})

	it('does not add duplicate car', () => {
		useCartStore.getState().addToCart(testCar)
		useCartStore.getState().addToCart(testCar)

		expect(useCartStore.getState().items).toHaveLength(1)
	})
})

describe('removeFromCart', () => {
	it('removes car by id', () => {
		useCartStore.getState().addToCart(testCar)
		useCartStore.getState().addToCart(testCar2)

		useCartStore.getState().removeFromCart('1')

		const { items } = useCartStore.getState()

		expect(items).toHaveLength(1)
		expect(items[0]).toEqual(testCar2)
	})
})

describe('clearCart', () => {
	it('clears all items', () => {
		useCartStore.getState().addToCart(testCar)
		useCartStore.getState().addToCart(testCar2)

		useCartStore.getState().clearCart()

		expect(useCartStore.getState().items).toHaveLength(0)
	})
})

describe('isInCart', () => {
	it('returns true if car is in cart', () => {
		useCartStore.getState().addToCart(testCar)

		expect(useCartStore.getState().isInCart(1)).toBe(true)
	})

	it('returns false if car is not in cart', () => {
		expect(useCartStore.getState().isInCart(1)).toBe(false)
	})
})

describe('totalPrice', () => {
	it('returns total price of all cars', () => {
		useCartStore.getState().addToCart(testCar)
		useCartStore.getState().addToCart(testCar2)
		const {items} = useCartStore.getState()
		const total = items.reduce((sum, item)=>sum+item.price,0)
		expect(total).toBe(240000)
	})
})