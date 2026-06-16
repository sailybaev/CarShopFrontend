'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
	productName: z.string().min(1, 'product name is required'),
	price: z.number().positive(),
	quantity: z.number().int(),
	category: z.enum(['product', 'home', 'other'])
})

type Data = z.infer<typeof schema>

export default function Home() {
	const { register, handleSubmit } = useForm<Data>({
		resolver: zodResolver(schema)
	})

	return (
		<>
			<form onSubmit={handleSubmit(console.log)}>
				<input {...register('productName')} />
				<input {...register('price', { valueAsNumber: true })} />
				<input {...register('quantity', { valueAsNumber: true })} />
				<select {...register('category')}>
					<option value='product'>Product</option>
					<option value='home'>Home</option>
					<option value='other'>Other</option>
				</select>
				<button>Submit</button>
			</form>
		</>
	)
}
