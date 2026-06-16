'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type Profile = {
	name: string, 
	lastName: string, 
	bio: string
}
export default function Profile(){
	const { register, handleSubmit, reset } = useForm<Profile>({
		defaultValues: {name: '', lastName:'', bio:''}
	})
useEffect(()=>{
	async function fetchProfile(){
		const user = { name: 'bob', lastName: 'p', bio:'test'}
		reset(user)
	}
	fetchProfile()
},[reset])
	

	return()
}

