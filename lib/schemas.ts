import { z } from 'zod'

export const loginFormSchema = z.object({
	email: z.email('invalid email').min(1, 'email is mandatary'),
	password: z
		.string()
		.min(6, 'password length should be at least 6 symbols')
		.max(128, 'max symbol count is 128')
})
const rolesEnum = z.enum(['customer', 'privateSeller'])

export const SignUpFormSchema = z.object({
	email: z.email('invalid email').min(1, 'email is mandatary'),
	password: z
		.string()
		.min(6, 'password length should be at least 6 symbols')
		.max(128, 'max symbol count is 128'),
	role: rolesEnum
})
export const ContactFormSchema = z.object({
	firstName: z.string().min(1, 'Write your first name'),
	lastName: z.string().min(1, 'Write your last name'),
	email: z.email('invalid email').min(1, 'write your email'),
	message: z.string().min(1, 'write your message')
})
export const CreateSellerFormSchema = z.object({
	companyName: z.string().min(1, 'Your company name is required'),
	city: z.string().min(1, 'Your city is required'),
	address: z.string().min(1, 'Your address is required'),
	mobilePhone: z.string().min(1, 'Your phone is required'),
	email: z.email('Invalid email').min(1, 'Your email is required')
})
export const EditListingSchema = z.object({
	city: z.string().min(1, 'city required').max(100, 'city is too long'),
	description: z.string().min(10, 'write at least 10 symbols')
})

export type FieldErrors<T> = Partial<Record<keyof T, string>>
export function ParseZodErrors<T>(error: z.ZodError): FieldErrors<T> {
	const errors: FieldErrors<T> = {}

	for (const x of error.issues) {
		const key = x.path[0] as keyof T
		if (!errors[key]) errors[key] = x.message
	}
	return errors
}
