'use client'

import { useAuth } from '@/app/context/authProvider'
import { useChatStore } from '@/store/chatStore'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useAuthStore } from '@/store/authStore'


interface MessageSellerButtonProps {
	listingId: string
	sellerId: string
	listingTitle: string
	listingImage?: string
}
interface Seller {
	id: string
	userId: string
	companyName: string
}
async function fetchSellerById(sellerId: string):Promise<Seller>{
	const response = await fetch(`http://localhost:5107/seller/${sellerId}`)

	if(!response.ok)
		throw new Error('Failed to load seller')

	return response.json()
}
export default function MessageSellerButton({
	listingId, sellerId, listingTitle, listingImage
}:MessageSellerButtonProps){
	const router = useRouter()
	const user = useAuthStore(x=>x.user)
	const {addConversations} = useChatStore()

	async function handleMessageSeller(){
		if(!user){
			router.push('/login')
			return
		}
		const seller = await fetchSellerById(sellerId)
		
		addConversations({listingId, otherUserId: seller.userId, listingTitle, listingImage: listingImage ?? ''}, user.id)
		router.push(`/chats?listing=${listingId}&user=${seller.userId}`)
	}
	return(
		<Button type='button' onClick={handleMessageSeller}>Message Seller</Button>
	)
}