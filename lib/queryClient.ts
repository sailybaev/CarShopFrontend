import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 300000,
            gcTime: 600000,
            retry: 3,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        }
    }
})
