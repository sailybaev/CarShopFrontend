import * as signalR from '@microsoft/signalr'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5107'

export interface ChatMsg {
	id: string
	senderID: string
	receiverID: string
	listingID: string
	message: string
	isRead: boolean
	createdAt: string
}

// Метаданные одного диалога для отображения в списке.
// Хранятся в localStorage под ключом chat_convs_{userId}.
export interface Conversation {
	listingId: string
	otherUserId: string // User.Id собеседника (не Seller.Id)
	listingTitle: string // например "2022 BMW X5"
	listingImage: string
}

// Ключ словаря сообщений — `${listingId}_${otherUserId}`.
type ConvKey = string

export function convKey(listingId: string, otherUserId: string): ConvKey {
	return `${listingId}_${otherUserId}`
}
interface ChatContextType {
	conversations: Conversation[]

	messages: Record<ConvKey, ChatMsg[]>
	loadHistory: (
		listingId: string,
		otherUserId: string,
		token: string
	) => Promise<void>
	sendMessage: (
		receiverId: string,
		listingId: string,
		text: string
	) => Promise<void>
	joinConversation: (listingId: string, otherUserId: string) => Promise<void>
	leaveConversation: (listingId: string, otherUserId: string) => Promise<void>
	connected: boolean
	_hub: signalR.HubConnection | null
	_userId: string | undefined
	loadConversations: (userId: string) => void
	addConversations: (conv: Conversation, userId: string) => void
	connect: (token: string, userId: string) => Promise<void>
	disconnect: () => Promise<void>
}

export const useChatStore = create<ChatContextType>()(
	persist(
		(set, get) => ({
			conversations: [],
			messages: {},
			connected: false,
			_hub: null,
			_userId: undefined,
			async connect(token, userId) {
				if (get()._hub) return
				set({ _userId: userId })
				const hub = new signalR.HubConnectionBuilder()
					.withUrl(`${API_URL}/hub/chat`, { accessTokenFactory: () => token })
					.withAutomaticReconnect()
					.build()

				hub.on('ReceiveMessage', (msg: ChatMsg) => {
					const me = userId
					// Определяем, кто является собеседником в этом сообщении.
					const otherId = msg.senderID === me ? msg.receiverID : msg.senderID
					const key = convKey(msg.listingID, otherId)
					set(prev => {
						const existing = prev.messages[key] ?? []
						if (existing.some(m => m.id === msg.id)) return {}
						return {
							messages: {
								...prev.messages,
								[key]: [...existing, msg]
							}
						}
					})
				})

				hub.on('ReceiveMarkAsRead', (senderId: string) => {
					set(prev => {
						const updated: Record<ConvKey, ChatMsg[]> = {}
						for (const [k, msgs] of Object.entries(prev.messages) as [
							ConvKey,
							ChatMsg[]
						][]) {
							updated[k] = msgs.map(m =>
								m.senderID === senderId ? { ...m, isRead: true } : m
							)
						}
						return { messages: updated }
					})
				})

				await hub.start().catch(() => {})

				set({
					_hub: hub,
					connected: hub.state === signalR.HubConnectionState.Connected
				})
			},
			async disconnect() {
				const hub = get()._hub
				if (hub) {
					await hub.stop().catch(() => {})
				}
				set({ _hub: null, connected: false, _userId: undefined })
			},
			async loadHistory(listingId, otherUserId, token) {
				try {
					const res = await fetch(
						`${API_URL}/api/chat/history/${listingId}/${otherUserId}`,
						{
							headers: { Authorization: `Bearer ${token}` }
						}
					)
					if (!res.ok) return
					const history: ChatMsg[] = await res.json()
					const key = convKey(listingId, otherUserId)
					set(prev => {
						const existing = prev.messages[key] ?? []
						const ids = new Set(existing.map(m => m.id))
						const fresh = history.filter(m => !ids.has(m.id))
						if (fresh.length === 0) return prev
						const merged = [...existing, ...fresh].sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime()
						)
						
						return { ...prev, messages:{...prev.messages, [key]: merged} }
					})
				} catch {}
			},
			async sendMessage(receiverId, listingId, text) {
				const hub = get()._hub
				if (!hub) return
				await hub
					.invoke('SendMessage', receiverId, listingId, text)
					.catch(() => {})
			},
			async joinConversation(listingId, otherUserId) {
				const hub = get()._hub
				if (!hub) return
				await hub
					.invoke('JoinConversation', listingId, otherUserId)
					.catch(() => {})
			},
			async leaveConversation(listingId, otherUserId) {
				const hub = get()._hub
				if (!hub) return
				await hub
					.invoke('LeaveConversation', listingId, otherUserId)
					.catch(() => {})
			},
			loadConversations(userId) {
				const stored = localStorage.getItem(`chat_convs_${userId}`)
				if (stored) {
					try {
						set(JSON.parse(stored))
					} catch {}
				}
			},
			addConversations(conv, userId) {
				set(prev => {
					const exists = prev.conversations.some(
						c =>
							c.listingId === conv.listingId &&
							c.otherUserId === conv.otherUserId
					)
					if (exists) return prev
					const updated = [conv, ...prev.conversations]

					localStorage.setItem(`chat_convs_${userId}`, JSON.stringify(updated))
					return { conversations: updated }
				})
			}
		}),
		{
			name: 'chat',
			partialize: state => ({
				conversations: state.conversations,
				messages: state.messages
			})
		}
	)
)
