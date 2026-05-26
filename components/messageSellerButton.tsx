'use client'

import { useAuth } from '@/app/context/authProvider'
import { useChat } from '@/lib/socket'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

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
	const {user} = useAuth()
	const {addConversation} = useChat()

	async function handleMessageSeller(){
		if(!user){
			router.push('/login')
			return
		}
		const seller = await fetchSellerById(sellerId)
		addConversation({listingId, otherUserId: seller.userId, listingTitle, listingImage: listingImage ?? ''})
		router.push(`/chats?listing=${listingId}&user=${seller.userId}`)
	}
	return(
		<Button type='button' onClick={handleMessageSeller}>Message Seller</Button>
	)
}