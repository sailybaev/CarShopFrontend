'use client'

import { useAuth } from '@/app/context/authProvider'
import { Conversation, convKey, useChat } from '@/lib/socket'
import { ArrowLeft } from 'lucide-react'
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
		<section className=' px-4 py-8 sm:px-8 sm:py-12'>
			<div className='mx-auto grid h-[75vh] max-w-6xl grid-cols-1 overflow-hidden rounded-md border border-border bg-background shadow-sm md:grid-cols-[320px_1fr]'>
				<aside
					className={`${selected ? 'hidden md:block' : 'block'} border-b border-border md:border-b-0 md:border-r`}
				>
					<header className='border-border border-b py-3.5 px-5'>
						<p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
							Messages
						</p>
						<h1 className='mt-1 text-xl font-bold'>Chats</h1>
						<div className='mt- flex items-center gap-2'>
							<span
								className={`h-2 w-2 rounded-full ${connected ? ' bg-green-600' : 'bg-red-500'}`}
							/>
							<p className=' text-sm text-muted-foreground'>
								{connected ? 'Connected' : 'Disconnected'}
							</p>
						</div>
					</header>
					<div className='max-h-65 overflow-y-auto md:max-h-none'>
						{conversations.map(conv => {
							const isActive =
								selected?.listingId === conv.listingId &&
								selected?.otherUserId === conv.otherUserId

							return (
								<Button
									key={`${conv.listingId}_${conv.otherUserId}`}
									onClick={() => setSelected(conv)}
									className={`flex w-full h-20 items-center gap-4 border-b border-border p-4 text-left transition ${
										isActive ? 'bg-secondary' : 'hover:bg-secondary/90'
									}`}
								>
									<img
										src={conv.listingImage}
										alt={conv.listingTitle}
										className='h-16 w-24 shrink-0 rounded-md object-cover'
									/>
									<div className='min-w-0 '>
										<p className='truncate font-semibold mt-1 text-muted-foreground'>
											{conv.listingTitle}
										</p>
										<p className='mb-1 text-xs text-muted-foreground'>
											Open Conversation
										</p>
									</div>
								</Button>
							)
						})}
					</div>
				</aside>

				<div
					className={`${!selected ? 'hidden md:flex' : 'flex'} min-w-0 flex-col md:flex`}
				>
					{!selected ? (
						<div className='flex flex-1 items-center justify-center p-6'>
							<p className='text-muted-foreground'>Select a conversation</p>
						</div>
					) : (
						<>
							<header className='flex items-center gap-4 border-b border-border p-5'>
								<Button
									type='button'
									variant='secondary'
									onClick={() => setSelected(null)}
									className='md:hidden rounded-md'
								>
									<ArrowLeft />
									Chats
								</Button>
								<img
									src={selected.listingImage}
									alt={selected.listingTitle}
									className='h-14 w-20 shrink-0 rounded-md object-cover'
								/>
								<div className='min-w-0'>
									<p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
										Conversation
									</p>
									<h2 className='truncate text-xl font-bold'>
										{selected.listingTitle}
									</h2>
								</div>
							</header>
							<div className='flex-1 overflow-y-auto bg-muted/20 p-6'>
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
												className={`mb-4 flex ${isMine ? 'justify-end' : 'justify-start'}`}
											>
												<div
													className={`max-w-[85%] rounded-md text-sm shadow-sm sm:max-w-[70%] px-4 py-3 ${isMine ? 'bg-primary text-primary-foreground' : 'border border-border  bg-backgound'}`}
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
									className='h-12 flex-1 rounded-md'
								/>
								<Button
									type='submit'
									disabled={!text.trim() || !connected}
									className='h-12 rounded-md px-5'
								>
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
