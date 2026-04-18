'use client'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'

export default function ContactForm() {
	return (
		<div>
			<form>
				<FieldGroup>
					<div className='grid grid-cols-2 gap-4'>
						<Field>
							<FieldLabel htmlFor='firstName'>First Name</FieldLabel>
							<Input
								id='firstName'
								type='text'
								placeholder='John...'
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
							<Input
								id='lastName'
								type='text'
								placeholder='Smith...'
								required
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
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor='message'>Message</FieldLabel>
						<Input
							id='message'
							type='text'
							placeholder='Your message here...'
						/>
					</Field>
					<Button type='submit' className='col-span-2'>
						Contact Us
					</Button>
				</FieldGroup>
			</form>
		</div>
	)
}
