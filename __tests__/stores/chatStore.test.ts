import { convKey, useChatStore } from '@/store/chatStore'
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { act } from '@testing-library/react'
import { vi, beforeEach } from 'vitest'

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

	useChatStore.setState({
		conversations: [],
		messages: {},
		connected: false,
		_hub: null,
		_userId: undefined
	})
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
})
