import { convKey, useChatStore } from '@/store/chatStore'
import { act } from '@testing-library/react'
import { beforeEach, vi } from 'vitest'

// const mockStart = vi.fn().mockResolvedValue(undefined)
// const mockStop = vi.fn().mockResolvedValue(undefined)
// const mockInvoke = vi.fn().mockResolvedValue(undefined)
// const mockOn = vi.fn()

// const mockHub = {
// 	on: mockOn,
// 	start: vi.fn().mockResolvedValue(undefined),
// 	stop: mockStop,
// 	invoke: mockInvoke,
// 	state: 'Connected'
// }

// const mockWithUrl = vi.fn().mockReturnThis()
// const mockWithAutomaticReconnect = vi.fn().mockReturnThis()
// const mockBuild = vi.fn().mockReturnValue(mockHub)

// vi.mock('@microsoft/signalr', () => ({
// 	HubConnectionState: {
// 		Connected: 'Connected'
// 	},
// 	HubConnectionBuilder: vi.fn().mockImplementation(() => ({
// 		withUrl: mockWithUrl,
// 		withAutomaticReconnect: mockWithAutomaticReconnect,
// 		build: mockBuild
// 	}))
// }))
//

vi.mock('@microsoft/signalr', () => ({
	HubConnectionBuilder: vi.fn().mockImplementation(() => ({
		withUrl: vi.fn().mockReturnThis(),
		mockWithAutomaticReconnect: vi.fn().mockReturnThis(),
		build: vi.fn().mockReturnValue({
			on: vi.fn(),
			start: vi.fn().mockResolvedValue(undefined),
			stop: vi.fn().mockResolvedValue(undefined),
			invoke: vi.fn().mockResolvedValue(undefined),
			state: 'Connected'
		})
	})),
	HubConnectionState: { Connected: 'Connected' }
}))

beforeEach(() => {
	vi.clearAllMocks()
	localStorage.clear()
	vi.stubGlobal('fetch', vi.fn())

	useChatStore.setState({
		conversations: [],
		messages: {},
		connected: false,
		_hub: null,
		_userId: undefined
	})
})
afterEach(() => {
	vi.unstubAllGlobals()
})

describe('chatStore initial state', () => {
	it('null', () => {
		expect(useChatStore.getState().conversations).toHaveLength(0)
		expect(useChatStore.getState().messages).toEqual({})
		expect(useChatStore.getState().connected).toBe(false)
		expect(useChatStore.getState()._hub).toBe(null)
		expect(useChatStore.getState()._userId).toBe(undefined)
	})
})
describe('convKey', () => {
	it('creates key from listingId and otherUserId', () => {
		expect(convKey('car1', 'user2')).toBe('car1_user2')
	})
})
describe('addConversations', () => {
	it('adds conversation', () => {
		const conversation = {
			listingId: '1',
			otherUserId: '2',
			listingTitle: 'BMW X5',
			listingImage: 'bmw.jpg'
		}

		act(() => {
			useChatStore.getState().addConversations(conversation, 'user1')
		})

		expect(useChatStore.getState().conversations).toHaveLength(1)
		expect(useChatStore.getState().conversations[0]).toEqual(conversation)
	})
	it('without duplicate', () => {
		const conversation = {
			listingId: '1',
			otherUserId: '2',
			listingTitle: 'BMW X5',
			listingImage: 'bmw.jpg'
		}

		act(() => {
			useChatStore.getState().addConversations(conversation, 'user1')
			useChatStore.getState().addConversations(conversation, 'user1')
		})

		expect(useChatStore.getState().conversations).toHaveLength(1)
	})
	it('new in the front', () => {
		const conversation1 = {
			listingId: '1',
			otherUserId: '2',
			listingTitle: 'BMW X5',
			listingImage: 'bmw.jpg'
		}
		const conversation2 = {
			listingId: '3',
			otherUserId: '5',
			listingTitle: 'Tesla X5',
			listingImage: 'tesla.jpg'
		}
		useChatStore.getState().addConversations(conversation1, 'user1')
		useChatStore.getState().addConversations(conversation2, 'user1')
		expect(useChatStore.getState().conversations[0]).toEqual(conversation2)
		expect(useChatStore.getState().conversations[1]).toEqual(conversation1)
	})
	it('localStorage not null', () => {
		const conversation2 = {
			listingId: '3',
			otherUserId: '5',
			listingTitle: 'Tesla X5',
			listingImage: 'tesla.jpg'
		}
		useChatStore.getState().addConversations(conversation2, 'user1')
		const result = localStorage.getItem('chat_convs_user1')
		expect(result).not.toBeNull()

		const data = JSON.parse(result!)
		expect(data).toHaveLength(1)
		expect(data[0].listingId).toBe('3')
	})
})
describe('loadConv', () => {
	it('load', () => {
		const t = [
			{
				listingId: '1',
				otherUserId: '2',
				listingTitle: 'Tesla',
				listingImage: ''
			}
		]
		localStorage.setItem('chat_convs_user1', JSON.stringify(t))
		useChatStore.getState().loadConversations('user1')
		const result = localStorage.getItem('chat_convs_user1')
		expect(result).not.toBeNull()
	})
	it('without key', () => {
		expect(() =>
			useChatStore.getState().loadConversations('user7')
		).not.toThrow()
	})
	it('not json', () => {
		localStorage.setItem('chat_convs_user1', 'text{{{')
		expect(() =>
			useChatStore.getState().loadConversations('user1')
		).not.toThrow()
	})
})
describe('disconnect', () => {
	it('test', () => {
		useChatStore.setState({ connected: true })
		useChatStore.getState().disconnect()
		expect(useChatStore.getState().connected).toBe(false)
		expect(useChatStore.getState()._hub).toBeNull()
		expect(useChatStore.getState()._userId).toBeUndefined()
	})
})
describe('loadHistory', () => {
	const mockMessages = [
		{
			id: 'msg-1',
			senderID: 'u-1',
			receiverID: 'u-2',
			listingID: 'l-1',
			message: 'Hello',
			isRead: false,
			createdAt: '2024-01-01T10:00:00Z'
		},
		{
			id: 'msg-2',
			senderID: 'u-2',
			receiverID: 'u-1',
			listingID: 'l-1',
			message: 'Hi there',
			isRead: true,
			createdAt: '2024-01-01T10:01:00Z'
		}
	]
	it('test1', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockMessages)
		} as unknown as Response)
		await useChatStore.getState().loadHistory('l-1', 'u-2', 'token')
		const key = convKey('l-1','u-2')
		const state = useChatStore.getState()
		

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('l-1/u-2'),
			expect.objectContaining({
				headers: expect.objectContaining({ Authorization: 'Bearer token' })
			})
		)
		expect(state.messages[key]).toHaveLength(2)
		
		
	})
})
