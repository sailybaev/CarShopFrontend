import { convKey, useChatStore } from '@/store/chatStore'
import { act } from '@testing-library/react'
import { vi } from 'vitest'

const mockStart = vi.fn().mockResolvedValue(undefined)
const mockStop = vi.fn().mockResolvedValue(undefined)
const mockInvoke = vi.fn().mockResolvedValue(undefined)
const mockOn = vi.fn()

const mockHub = {
	on: mockOn,
	start: mockStart,
	stop: mockStop,
	invoke: mockInvoke,
	state: 'Connected'
}

const mockWithUrl = vi.fn().mockReturnThis()
const mockWithAutomaticReconnect = vi.fn().mockReturnThis()
const mockBuild = vi.fn().mockReturnValue(mockHub)

vi.mock('@microsoft/signalr', () => ({
	HubConnectionState: {
		Connected: 'Connected'
	},
	HubConnectionBuilder: vi.fn().mockImplementation(() => ({
		withUrl: mockWithUrl,
		withAutomaticReconnect: mockWithAutomaticReconnect,
		build: mockBuild
	}))
}))

beforeEach(() => {
	vi.clearAllMocks()
	localStorage.clear()

	act(() => {
		useChatStore.setState({
			conversations: [],
			messages: {},
			connected: false,
			_hub: null,
			_userId: undefined
		})
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
