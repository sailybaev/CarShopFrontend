import AddToCartButton from '@/components/addToCartButton'
import type { Car } from '@/lib/cars'
import { useCartStore } from '@/store/cartStore'
import { act, fireEvent, render, screen } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
const testCar: Car = {
	id: '1',
	name: 'T',
	brand: 'Tesla',
	year: 2010,
	price: 150000,
	sellerId: '5'
}
const testCar2: Car = {
	id: '2',
	name: 'D',
	brand: 'BMW',
	year: 2000,
	price: 90000,
	sellerId: '2'
}
beforeEach(() => {
	act(() => {
		useCartStore.setState({ items: [] })
	})
})
describe('test', () => {
	it('1.render', () => {
		render(<AddToCartButton car={testCar} />)
		expect(screen.getByText('Add to Cart')).toBeInTheDocument()
	})
	it('changing text', () => {
		act(() => {
			useCartStore.setState({ items: [testCar] })
		})
		render(<AddToCartButton car={testCar} />)
		fireEvent.click(screen.getByRole('button'))
		expect(screen.getByText('Added')).toBeInTheDocument()
	})
	it('removes car ',async () => {
		act(() => {
			useCartStore.setState({ items: [testCar] })
		})
		const user = userEvent.setup()

		render(<AddToCartButton car={testCar} />)

		await user.click(screen.getByRole('button'))

		expect(useCartStore.getState().items).toHaveLength(0)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})
})
