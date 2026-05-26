import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useEffect } from 'react'

export default function ChatConnect() {
	const token = useAuthStore(x => x.token)
	const user = useAuthStore(x => x.user)
  const connect = useChatStore(x => x.connect)
	const disconnect = useChatStore(x => x.disconnect)
	const loadConversations = useChatStore(x => x.loadConversations)

	useEffect(()=>{
		if(token && user) {
			connect(token, user.id)
			loadConversations(user.id)
		}
		else {disconnect()}
	},[token, user?.id])
	return null
}
