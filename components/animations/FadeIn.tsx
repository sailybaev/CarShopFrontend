'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ReactNode } from 'react'

interface FadeInProps {
	children: ReactNode
	className?: string
	delay?: number
	trigger?: 'mount' | 'view'
	once?: boolean
	amount?: number
	distance?: number
}

export default function FadeIn({
	children,
	className,
	delay = 0,
	trigger = 'view',
	once = true,
	amount = 0.2,
	distance = 40
}: FadeInProps) {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>
	}

	const variants = {
		initial: { opacity: 0, y: distance },
		animate: { opacity: 1, y: 0 }
	}

	if (trigger === 'mount') {
		return (
			<motion.div
				className={className}
				initial='initial'
				animate='animate'
				variants={variants}
				transition={{ duration: 0.8, delay, ease: 'easeOut' }}
			>
				{children}
			</motion.div>
		)
	}

	return (
		<motion.div
			className={className}
			initial='initial'
			whileInView='animate'
			variants={variants}
			transition={{ duration: 0.8, delay, ease: 'easeOut' }}
			viewport={{ once, amount }}
		>
			{children}
		</motion.div>
	)
}
