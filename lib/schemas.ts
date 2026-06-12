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

export type FieldErrors<T> = Partial<Record<keyof T, string>>
export function ParseZodErrors<T>(error: z.ZodError): FieldErrors<T>{
	const errors: FieldErrors<T> = {}

	for(const x of error.issues){
		const key = x.path[0] as keyof T
		if(!errors[key]) errors[key] = x.message
	}
	return errors
}