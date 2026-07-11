'use client'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { submitContactForm } from '@/lib/api'
import { useState } from 'react'
import { Button } from './ui/button'

export default function ContactForm() {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
	const [statusMessage, setStatusMessage] = useState('')

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setStatus('loading')
		setStatusMessage('')

		const result = await submitContactForm({
			firstName,
			lastName,
			email,
			message
		})

		if (result.success) {
			setStatus('success')
			setStatusMessage('Thank you for your message. We will get back to you soon.')
			setFirstName('')
			setLastName('')
			setEmail('')
			setMessage('')
		} else {
			setStatus('error')
			setStatusMessage(result.error ?? 'Something went wrong. Please try again.')
		}
	}

	return (
		<div className='mx-auto max-w-2xl'>
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
						<Field>
							<FieldLabel htmlFor='firstName'>First Name</FieldLabel>
							<Input
								id='firstName'
								type='text'
								placeholder='John'
								required
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								disabled={status === 'loading'}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
							<Input
								id='lastName'
								type='text'
								placeholder='Smith'
								required
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								disabled={status === 'loading'}
							/>
						</Field>
					</div>
					<Field>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							id='email'
							type='email'
							placeholder='john.smith@example.com'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={status === 'loading'}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='message'>Message</FieldLabel>
						<textarea
							id='message'
							rows={5}
							placeholder='Your message here...'
							required
							value={message}
							onChange={e => setMessage(e.target.value)}
							disabled={status === 'loading'}
							className='min-h-[120px] w-full border border-input bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50'
						/>
					</Field>
					{statusMessage && (
						<p
							className={`text-sm ${status === 'error' ? 'text-destructive' : 'text-emerald-700'}`}
							role='status'
						>
							{statusMessage}
						</p>
					)}
					<Button type='submit' size='lg' className='w-full' disabled={status === 'loading'}>
						{status === 'loading' ? 'Sending...' : 'Contact Us'}
					</Button>
				</FieldGroup>
			</form>
		</div>
	)
}
