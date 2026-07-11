import Messenger from '@/components/messenger'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

const mockLoadHistory = vi.fn()
const mockSendMessage = vi.fn()
const mockJoinConversation = vi.fn()
const mockLeaveConversation = vi.fn()

vi.mock('@/store/chatStore', () => ({
	convKey: (listingId: string, otherUserId: string) =>
		`${listingId}_${otherUserId}`,
	useChatStore: vi.fn()
}))
const mockUseChatStore = vi.mocked(useChatStore)
const conversation = {
	listingId: 'car1',
	otherUserId: 'user2',
	listingTitle: 'BMW X5',
	listingImage: '/bmw.jpg'
}

const myMessage = {
	id: 'm1',
	senderID: 'user1',
	receiverID: 'user2',
	listingID: 'car1',
	message: 'Hello',
	isRead: false,
	createdAt: '2026-01-01T10:00:00Z'
}

beforeEach(() => {
	vi.clearAllMocks()

	useAuthStore.setState({
		user: {
			id: 'user1',
			email: 'test@test.com',
			role: 'customer'
		},
		token: 'token'
	})

	mockUseChatStore.mockReturnValue({
		conversations: [],
		messages: {},
		loadHistory: mockLoadHistory,
		sendMessage: mockSendMessage,
		joinConversation: mockJoinConversation,
		leaveConversation: mockLeaveConversation,
		connected: false
	} as unknown as ReturnType<typeof useChatStore>)
})

describe('Messenger', () => {
	it('shows empty state when there are no conversations', () => {
		render(<Messenger />)

		expect(screen.getByText('No conversation yet')).toBeInTheDocument()
		expect(
			screen.getByText('Start a conversation from a car listing page')
		).toBeInTheDocument()
		expect(screen.getByText('Visit Our Store')).toBeInTheDocument()
	})

	it('renders conversations list', () => {
		mockUseChatStore.mockReturnValue({
			conversations: [conversation],
			messages: {},
			loadHistory: mockLoadHistory,
			sendMessage: mockSendMessage,
			joinConversation: mockJoinConversation,
			leaveConversation: mockLeaveConversation,
			connected: true
		} as unknown as ReturnType<typeof useChatStore>)

		render(<Messenger />)

		expect(screen.getByText('Chats')).toBeInTheDocument()
		expect(screen.getByText('BMW X5')).toBeInTheDocument()
		expect(screen.getByText('Connected')).toBeInTheDocument()
		expect(screen.getByText('Select a conversation')).toBeInTheDocument()
	})

	it('selects conversation and calls loadHistory and joinConversation', async () => {
		mockUseChatStore.mockReturnValue({
			conversations: [conversation],
			messages: {},
			loadHistory: mockLoadHistory,
			sendMessage: mockSendMessage,
			joinConversation: mockJoinConversation,
			leaveConversation: mockLeaveConversation,
			connected: true
		} as unknown as ReturnType<typeof useChatStore>)

		render(<Messenger />)

		fireEvent.click(screen.getByText('BMW X5'))

		expect(screen.getByText('Conversation')).toBeInTheDocument()
		expect(screen.getAllByText('BMW X5')[0]).toBeInTheDocument()

		await waitFor(() => {
			expect(mockLoadHistory).toHaveBeenCalledWith('car1', 'user2', 'token')
		})

		expect(mockJoinConversation).toHaveBeenCalledWith('car1', 'user2')
		expect(screen.getByText('No messages yet')).toBeInTheDocument()
	})

	it('shows messages for selected conversation', () => {
		mockUseChatStore.mockReturnValue({
			conversations: [conversation],
			messages: {
				car1_user2: [myMessage]
			},
			loadHistory: mockLoadHistory,
			sendMessage: mockSendMessage,
			joinConversation: mockJoinConversation,
			leaveConversation: mockLeaveConversation,
			connected: true
		} as unknown as ReturnType<typeof useChatStore>)

		render(<Messenger />)

		fireEvent.click(screen.getByText('BMW X5'))

		expect(screen.getByText('Hello')).toBeInTheDocument()
		expect(screen.getByText('Sent')).toBeInTheDocument()
	})

	it('sends message and clears input', async () => {
		mockSendMessage.mockResolvedValue(undefined)

		mockUseChatStore.mockReturnValue({
			conversations: [conversation],
			messages: {},
			loadHistory: mockLoadHistory,
			sendMessage: mockSendMessage,
			joinConversation: mockJoinConversation,
			leaveConversation: mockLeaveConversation,
			connected: true
		} as unknown as ReturnType<typeof useChatStore>)

		render(<Messenger />)

		fireEvent.click(screen.getByText('BMW X5'))

		const input = screen.getByPlaceholderText('Type a message...')
		const button = screen.getByRole('button', { name: 'Send' })

		fireEvent.change(input, {
			target: { value: 'Hi there' }
		})

		fireEvent.click(button)

		await waitFor(() => {
			expect(mockSendMessage).toHaveBeenCalledWith('user2', 'car1', 'Hi there')
		})

		expect(input).toHaveValue('')
	})

	it('does not send empty message', () => {
		mockUseChatStore.mockReturnValue({
			conversations: [conversation],
			messages: {},
			loadHistory: mockLoadHistory,
			sendMessage: mockSendMessage,
			joinConversation: mockJoinConversation,
			leaveConversation: mockLeaveConversation,
			connected: true
		} as unknown as ReturnType<typeof useChatStore>)

		render(<Messenger />)

		fireEvent.click(screen.getByText('BMW X5'))

		fireEvent.click(screen.getByRole('button', { name: 'Send' }))

		expect(mockSendMessage).not.toHaveBeenCalled()
	})
})
