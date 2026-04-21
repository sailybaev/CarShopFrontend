interface props {
	text1: string
	text2: string
	text3: string
}

export default function InventoryHeader({ text1, text2, text3 }: props) {
	return (
		<div className='border-b border-border bg-secondary text-secondary-foreground px-8 py-20'>
			<div className='mx-auto'>
				<p className='uppercase text-xs font-semibold '>{text1}</p>
				<h1 className='font-bold text-6xl mt-4 text-muted-foreground'>
					{text2}
				</h1>
				{text3 && <p className='mt-4 max-w-xl text-lg'>{text3}</p>}
			</div>
		</div>
	)
}
