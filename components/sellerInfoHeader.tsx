'use client'
import { useAuth } from '@/app/context/authProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

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
async function getSellerByUserId(userId: string): Promise<Seller> {
	const sellerId = localStorage.getItem('sellerId')
	const response = await fetch(
		`https://carshop.sailybaev.kz/seller/${sellerId}`
	)

	if (!response.ok) {
		throw new Error('Failed')
	}

	return response.json()
}
export default function SellerInfoHeader() {
	const router = useRouter()
	const { user } = useAuth()

	const [seller, setSeller] = useState<Seller | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!user) {
			router.push('/login')
			return
		}
		async function loadSeller() {
			try {
				const seller = await getSellerByUserId(user!.id)
				setSeller(seller)
				localStorage.setItem('sellerId', seller.id)
			} catch (error) {
				console.log('error')
			} finally {
				setLoading(false)
			}
		}
		loadSeller()
	}, [user, router])

	if (loading) {
		return <p>Loading seller profile</p>
	}
	if (!seller) {
		return <p>No seller was found</p>
	}

	return (
		<section className='border-b border-border px-8 py-20'>
			<div className='mx-auto flex itmes-center justify-between'>
				<div>
					<p className='text-xs font-semibold uppercase text-muted-foreground'>
						Seller Dashboard
					</p>
					<h1 className='mt-2 text-2xl font-bold'>{seller.compnayName}</h1>
					<p className='text-xs font-semibold uppercase text-muted-foreground'>
						{seller.companyCity},{seller.companyAddress}
					</p>
					<p className='text-xs font-semibold uppercase text-muted-foreground'>
						Contacts: {seller.companyEmail},{seller.companyPhoneNumber}
					</p>
				</div>
				<Button>New Listing</Button>
				{/*//РЕАЛИЗОВАТЬ!*/}
			</div>
		</section>
	)
}
