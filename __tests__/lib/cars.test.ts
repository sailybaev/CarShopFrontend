import { formatPrice, formatMileage } from '@/lib/cars';
describe ('formatPrice',()=>{
	it('testA',()=>{
		expect(formatPrice(0)).toBe('$0')
	})
	it('testB', ()=>{
		expect(formatPrice(45000)).toBe('$45,000')
	})
	it('testC', ()=>{
		expect(formatPrice(45000.99)).toBe('$45,001')
	})
	it('testD', ()=>{
		expect(formatPrice(1500000)).toBe('$1,500,000')
	})
	
})
describe('formatMileage',()=>{
	it('testA', ()=>{
		expect(formatMileage(45000)).toBe('45,000 mi')
	})
	it('testB', ()=>{
		expect(formatMileage(0)).toBe('0 mi')
	})
	
	it('testD', ()=>{
		expect(formatMileage(1500000)).toBe('1,500,000 mi')
	})
})