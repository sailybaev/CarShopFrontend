'use client'

import { useAuth } from '@/app/context/authProvider'
import { Conversation, convKey, useChat } from '@/lib/socket'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Messenger() {
	const { user } = useAuth()
	const {
		conversations,
		messages,
		loadHistory,
		sendMessage,
		joinConversation,
		leaveConversation,
		connected
	} = useChat()

	const [selected, setSelected] = useState<Conversation | null>(null)
	const [text, setText] = useState('')
	useEffect(() => {
		if (!selected) return
		loadHistory(selected.listingId, selected.otherUserId)
		joinConversation(selected.listingId, selected.otherUserId)

		return () => {
			leaveConversation(selected.listingId, selected.otherUserId)
		}
	}, [selected])

	const key = selected
		? convKey(selected.listingId, selected.otherUserId)
		: null
	const currentMessages = key ? (messages[key] ?? []) : []

	async function handleSend(e: React.FormEvent) {
		e.preventDefault()

		if (!selected) return
		if (!text.trim()) return

		await sendMessage(selected.otherUserId, selected.listingId, text.trim())
		setText('')
	}
	if (conversations.length === 0) {
		return (
			<section className='flex items-center justify-center px-8 py-20'>
				<div className='text-center'>
					<p>Messages</p>
					<h1 className='mt-3 text-4xl font-bold'>No conversation yet</h1>
					<p>Start a conversation from a car listing page</p>
					<Button
						className='px-8 mt-4 text-md font-semibold uppercase hover:bg-white/10'
						asChild
					>
						<Link href='/inventory'> Visit Our Store </Link>
					</Button>
				</div>
			</section>
		)
	}

	return (
		<section className='px-8 py-20'>
			<div className='grid h-175 grid-cols-[320px_1fr] border border-border'>
				<aside className='border-r border-border'>
					<div className='border-border border-b p-5'>
						<p className='text-xs font-semibold uppercase text-muted-foreground'>
							Messages
						</p>
						<h1 className='mt-1 text-2xl font-bold'>Chats</h1>
						<div
							className={`rounded-full ${connected ? ' fill-green-700' : 'fill-red'}`}
						/>
						<p className='mt-2 text-xs text-muted-foreground'>
							{connected ? 'Connected' : 'Disconnected'}
						</p>
					</div>
					<div>
						{conversations.map(conv => {
							const isActive =
								selected?.listingId === conv.listingId &&
								selected?.otherUserId === conv.otherUserId

							return (
								<Button
									key={`${conv.listingId}_${conv.otherUserId}`}
									onClick={() => setSelected(conv)}
									className={`flex w-full gap-4 border-b border-border p-4 text-left transition ${
										isActive ? 'bg-secondary' : 'hover:bg-secondary/60'
									}`}
								>
									<img
										src={conv.listingImage}
										alt={conv.listingTitle}
										className='h-16 w-24 object-cover'
									/>
									<div className='min-w-0'>
										<p className='truncate font-semibold'>
											{conv.listingTitle}
										</p>
										<p className='mt-1 text-xs text-muted-foreground'>
											Open Conversation
										</p>
									</div>
								</Button>
							)
						})}
					</div>
				</aside>

				<div className='flex min-w-0 flex-col'>
					{!selected ? (
						<div className='flex flex-1 items-center justify-center'>
							<p className='text-muted-foreground'>Select a conversation</p>
						</div>
					) : (
						<>
							<header className='flex items-center gap-4 border-b border-border p-5'>
								<img
									src={selected.listingImage}
									alt={selected.listingTitle}
									className='h-14 w-20 object-cover'
								/>
								<div>
									<p className='text-xs font-semibold uppercase text-muted-foreground'>
										Conversation
									</p>
									<h2 className='text-xl font-bold'>{selected.listingTitle}</h2>
								</div>
							</header>
							<div className='flex-1 overflow-y-auto p-6'>
								{currentMessages.length === 0 ? (
									<div className='flex h-full items-center justify-center'>
										<p className='text-muted-foreground'>No messages yet</p>
									</div>
								) : (
									currentMessages.map(msg => {
										const isMine = msg.senderID === user?.id

										return (
											<div
												key={msg.id}
												className={`mb-4 flex ${isMine} ? 'justify-end' : 'justify-start'`}
											>
												<div
													className={`max-w-[70%] border border-border px-4 py-3 ${isMine ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
												>
													<p>{msg.message}</p>
													<div className='mt-2 flex items-center gap-2 text-xs opacity-70'>
														<span>
															{new Date(msg.createdAt).toLocaleTimeString([], {
																hour: '2-digit',
																minute: '2-digit'
															})}
														</span>
														{isMine && (
															<span>{msg.isRead ? 'Read' : 'Sent'}</span>
														)}
													</div>
												</div>
											</div>
										)
									})
								)}
							</div>

							<form
								onSubmit={handleSend}
								className='flex gap-3 border-t border-border p-5'
							>
								<Input
									value={text}
									onChange={e => setText(e.target.value)}
									placeholder='Type a message...'
									className='h-12 flex-1'
								/>
								<Button type='submit' disabled={!text.trim() || !connected}>
									Send
								</Button>
							</form>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
