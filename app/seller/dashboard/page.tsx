'use client'

import CreateSellerForm from '@/components/createSellerForm'
import SellerInfoHeader from '@/components/sellerInfoHeader'
import SellerListings from '@/components/sellerListings'
import { useEffect, useState } from 'react'

export default function SellerDashboard() {
	
	const [sellerId, setSellerId] = useState<string | null>(null)

 useEffect(() => {
	const id = localStorage.getItem('sellerId')
	setSellerId(id)
}, [])
	return (
		<>
			{sellerId ? (
				<>
					<SellerInfoHeader />
					<SellerListings />
				</>
			) : (
				<CreateSellerForm />
			)}
		</>
	)
}
