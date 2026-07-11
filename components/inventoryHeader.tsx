import FadeIn from '@/components/animations/FadeIn'

interface props {
	text1: string
	text2: string
	text3: string
}

export default function InventoryHeader({ text1, text2, text3 }: props) {
	return (
		<div className='border-b border-border bg-secondary text-secondary-foreground px-6 pt-20 pb-16 md:px-12 md:pt-24 md:pb-24'>
			<div className='mx-auto max-w-7xl'>
				<FadeIn>
					<p className='text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>{text1}</p>
					<h1 className='mt-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl lg:text-6xl'>
						{text2}
					</h1>
					{text3 && <p className='mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>{text3}</p>}
				</FadeIn>
			</div>
		</div>
	)
}
