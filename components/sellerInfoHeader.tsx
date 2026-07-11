'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

interface Seller {
	id: string
	compnayName: string
	userId: string
	companyCity: string
	companyAddress: string
	companyPhoneNumber: string
	companyEmail: string
	isVerified: boolean
}
async function getSellerByUserId(): Promise<Seller> {
	const sellerId = localStorage.getItem('sellerId')
	const response = await fetch(
		`http://localhost:5107/seller/${sellerId}`
	)

	if (!response.ok) {
		throw new Error('Failed')
	}

	return response.json()
}
export default function SellerInfoHeader() {
	const router = useRouter()
	const user  = useAuthStore(x=>x.user)

	const [seller, setSeller] = useState<Seller | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!user) {
			router.push('/login')
			return
		}
		async function loadSeller() {
			try {
				const seller = await getSellerByUserId()
				setSeller(seller)
				localStorage.setItem('sellerId', seller.id)
			} catch {
				console.log('error')
			} finally {
				setLoading(false)
			}
		}
		loadSeller()
	}, [user, router])

	if (loading) {
		return <p className='px-6 py-20'>Loading seller profile</p>
	}
	if (!seller) {
		return <p className='px-6 py-20'>No seller was found</p>
	}

	return (
		<section className='border-b border-border bg-secondary px-6 py-16 md:px-12 md:py-20'>
			<div className='mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between'>
				<div>
					<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
						Seller Dashboard
					</p>
					<h1 className='mt-2 text-3xl font-bold uppercase tracking-tight md:text-4xl'>{seller.compnayName}</h1>
					<p className='mt-3 text-sm text-muted-foreground'>
						{seller.companyCity}, {seller.companyAddress}
					</p>
					<p className='text-sm text-muted-foreground'>
						{seller.companyEmail} · {seller.companyPhoneNumber}
					</p>
				</div>
				<Button size='lg' asChild>
					<Link href='/seller/listings/new'>New Listing</Link>
				</Button>
			</div>
		</section>
	)
}
