'use client'
import  SignupForm  from '@/components/signup-form'

export default function SignupPage() {
	return (
		<div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-12'>
			<div className='w-full max-w-md border border-border bg-card p-8 md:p-12 shadow-sm'>
				<SignupForm />
			</div>
		</div>
	)
}
