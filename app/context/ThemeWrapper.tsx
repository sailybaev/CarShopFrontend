'use client'
import { useContext } from 'react'
import { ThemeContext } from '@/app/context/provider'

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { theme } = useContext(ThemeContext);

	return (
		<div className={theme}>
			{children}
		</div>
	);
}