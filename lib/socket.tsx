'use client'

// ChatContext — глобальное состояние чата.
// Управляет подключением к SignalR-хабу, списком диалогов и сообщениями.
// Оборачивает всё приложение через ChatProvider в app/layout.tsx.

import { useAuthStore } from '@/store/authStore'
import * as signalR from '@microsoft/signalr'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5107'

// Сообщение чата — зеркало серверной модели ChatMessage.
// Имена полей сохранены как на бэкенде (camelCase от C# свойств).
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

interface ChatContextType {
	conversations: Conversation[]
	addConversation: (conv: Conversation) => void
	// Сообщения сгруппированы по ключу диалога.
	messages: Record<ConvKey, ChatMsg[]>
	loadHistory: (listingId: string, otherUserId: string) => Promise<void>
	sendMessage: (
		receiverId: string,
		listingId: string,
		text: string
	) => Promise<void>
	joinConversation: (listingId: string, otherUserId: string) => Promise<void>
	leaveConversation: (listingId: string, otherUserId: string) => Promise<void>
	connected: boolean
}

const ChatContext = createContext<ChatContextType | null>(null)

// Формирует строковый ключ для конкретного диалога.
export function convKey(listingId: string, otherUserId: string): ConvKey {
	return `${listingId}_${otherUserId}`
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const token = useAuthStore(t => t.token)
	const user = useAuthStore(u => u.user)
	const [conversations, setConversations] = useState<Conversation[]>([])
	const [messages, setMessages] = useState<Record<ConvKey, ChatMsg[]>>({})
	const [connected, setConnected] = useState(false)

	// Ref на HubConnection позволяет обращаться к нему из любого места без
	// включения в зависимости useEffect (чтобы не пересоздавать соединение).
	const hubRef = useRef<signalR.HubConnection | null>(null)

	// Ref на userId нужен внутри замыкания ReceiveMessage, чтобы не получить
	// устаревшее значение user из состояния на момент регистрации обработчика.
	const userIdRef = useRef<string | undefined>(undefined)

	useEffect(() => {
		userIdRef.current = user?.id
	}, [user?.id])

	// Восстанавливаем список диалогов из localStorage при входе пользователя.
	useEffect(() => {
		if (!user) return
		const stored = localStorage.getItem(`chat_convs_${user.id}`)
		if (stored) {
			try {
				setConversations(JSON.parse(stored))
			} catch {}
		}
	}, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

	// Создаём SignalR-соединение при наличии JWT-токена.
	// При выходе или смене пользователя соединение закрывается.
	useEffect(() => {
		if (!token) {
			hubRef.current?.stop()
			hubRef.current = null
			setConnected(false)
			return
		}

		const hub = new signalR.HubConnectionBuilder()
			// accessTokenFactory передаёт токен как query-параметр ?access_token=...
			// при WebSocket-рукопожатии — так работает SignalR с JWT.
			.withUrl(`${API_URL}/hub/chat`, { accessTokenFactory: () => token })
			.withAutomaticReconnect()
			.build()

		// Входящее сообщение — добавляем в нужный диалог, исключая дубликаты.
		hub.on('ReceiveMessage', (msg: ChatMsg) => {
			const me = userIdRef.current
			// Определяем, кто является собеседником в этом сообщении.
			const otherId = msg.senderID === me ? msg.receiverID : msg.senderID
			const key = convKey(msg.listingID, otherId)
			setMessages(prev => {
				const existing = prev[key] ?? []
				if (existing.some(m => m.id === msg.id)) return prev
				return { ...prev, [key]: [...existing, msg] }
			})
		})

		// Сервер уведомляет, что собеседник прочитал сообщения.
		hub.on('ReceiveMarkAsRead', (senderId: string) => {
			setMessages(prev => {
				const updated: Record<ConvKey, ChatMsg[]> = {}
				for (const [k, msgs] of Object.entries(prev)) {
					updated[k] = msgs.map(m =>
						m.senderID === senderId ? { ...m, isRead: true } : m
					)
				}
				return updated
			})
		})

		hub
			.start()
			.then(() => setConnected(true))
			.catch(() => {})

		hubRef.current = hub

		return () => {
			hub.stop()
			setConnected(false)
		}
	}, [token]) // eslint-disable-line react-hooks/exhaustive-deps

	// Добавляет диалог в список и сохраняет в localStorage.
	// Не добавляет дубликаты — проверяет по (listingId, otherUserId).
	function addConversation(conv: Conversation) {
		setConversations(prev => {
			const exists = prev.some(
				c =>
					c.listingId === conv.listingId && c.otherUserId === conv.otherUserId
			)
			if (exists) return prev
			const updated = [conv, ...prev]
			if (user)
				localStorage.setItem(`chat_convs_${user.id}`, JSON.stringify(updated))
			return updated
		})
	}

	// Загружает историю переписки с сервера и мёрджит с уже имеющимися сообщениями.
	// Из-за особенности бэкенда возвращаются сообщения в обоих направлениях
	// (после исправления запроса в ChatMessageRepository).
	async function loadHistory(listingId: string, otherUserId: string) {
		if (!token) return
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
			setMessages(prev => {
				const existing = prev[key] ?? []
				const ids = new Set(existing.map(m => m.id))
				const fresh = history.filter(m => !ids.has(m.id))
				if (fresh.length === 0) return prev
				const merged = [...existing, ...fresh].sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				)
				return { ...prev, [key]: merged }
			})
		} catch {}
	}

	// Подписываемся на SignalR-группу для конкретного диалога.
	// Без вызова JoinConversation входящие сообщения не будут приходить.
	async function joinConversation(listingId: string, otherUserId: string) {
		if (hubRef.current?.state !== signalR.HubConnectionState.Connected) return
		await hubRef.current.invoke('JoinConversation', listingId, otherUserId)
	}

	async function leaveConversation(listingId: string, otherUserId: string) {
		if (hubRef.current?.state !== signalR.HubConnectionState.Connected) return
		await hubRef.current.invoke('LeaveConversation', listingId, otherUserId)
	}

	async function sendMessage(
		receiverId: string,
		listingId: string,
		text: string
	) {
		if (hubRef.current?.state !== signalR.HubConnectionState.Connected) return
		await hubRef.current.invoke('SendMessage', receiverId, listingId, text)
	}

	return (
		<ChatContext.Provider
			value={{
				conversations,
				addConversation,
				messages,
				loadHistory,
				sendMessage,
				joinConversation,
				leaveConversation,
				connected
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}

export function useChat() {
	const ctx = useContext(ChatContext)
	if (!ctx) throw new Error('useChat must be used inside ChatProvider')
	return ctx
}
