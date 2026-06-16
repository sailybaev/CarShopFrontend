'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
	customer: z.object({
		name: z.string(),
		email: z.string().min(1, 'email is required').email('invalid email')
	}),
	addrees: z.object({
		city: z.string(),
		street: z.string(),
		houseNumber: z.string()
	}),
	paymentMethod: z.enum(['cash', 'card']),
	terms: z.literal(true)
})

type Data = z.infer<typeof schema>

export default function Profile() {
	const { register, handleSubmit, watch } = useForm<Data>({
		resolver: zodResolver(schema)
	})
	const t = watch('paymentMethod')
	
}
