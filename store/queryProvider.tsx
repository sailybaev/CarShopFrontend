'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({children}:{children:ReactNode}){
	const [queryClient] = useState(()=>{ return new QueryClient ({ defaultOptions: {
        queries: {
            staleTime: 300000,
            gcTime: 600000,
            retry: 3,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        }
     }})})
		return (
			<QueryClientProvider client={queryClient}>
			{children}
			</QueryClientProvider>
		)
}