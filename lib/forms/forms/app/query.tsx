import { useMutation } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

export function addUser() {
	const mutation = useMutation({
		mutationFn: async (newUser: { name: string }) => {
			const result = fetch('https://jsonplaceholder.typicode.com/users', {
				method: 'Post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newUser)
			})
			return (await result).json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		}
	})
	return <button onClick={() => mutation.mutate({ name: 'seika' })}></button>
}
