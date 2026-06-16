'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	email: z.string().min(1, 'email is required').email('invalid email'),

	password: z.string().min(8, 'password is required')
})

type FormData = z.infer<typeof schema>

export default function Example() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<FormData>({
		resolver: zodResolver(schema)
	})

	async function onSubmit(data: FormData) {
		console.log(data)

		await new Promise(resolve => setTimeout(resolve, 2000))
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-md mx-auto p-6 space-y-4'
		>
			<h1>Login</h1>
			<input
				type='text'
				{...register('email')}
				className='w-full border p-3 '
			/>

			{errors.email && <p className='text-red-500'>{errors.email.message}</p>}

			<input
				type='password'
				{...register('password')}
				className='w-full border p-3 '
			/>

			{errors.password && (
				<p className='text-red-500'>{errors.password.message}</p>
			)}

			<button type='submit' disabled={isSubmitting}>
				Submit
			</button>
		</form>
	)
}
