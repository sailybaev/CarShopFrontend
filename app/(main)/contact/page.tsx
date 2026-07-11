import ContactForm from '@/components/contact-form'
import InventoryHeader from '@/components/inventoryHeader'
import YandexMap from '@/components/yandexMap'

export default function ContactUs() {
	return (
		<section className='min-h-screen'>
			<InventoryHeader
				text1={'Contact Us'}
				text2={'Let’s Find Your Next Car'}
				text3={
					'Reach out to our team for assistance with vehicle selection, reservations, and test drives.We’re here to make your car buying experience simple and seamless.'
				}
			/>

			<div className='grid grid-cols-1 lg:grid-cols-2'>
				<div className='px-6 py-16 md:px-12 md:py-24 bg-secondary text-secondary-foreground'>
					<div className='mx-auto max-w-xl'>
						<p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
							Send a Message
						</p>
						<h2 className='mt-3 text-2xl font-bold uppercase tracking-tight md:text-3xl'>
							Get in Touch
						</h2>
						<div className='mt-8'>
							<ContactForm />
						</div>
					</div>
				</div>
				<div className='h-[400px] lg:h-auto min-h-[400px]'>
					<YandexMap lat={50.0755} lng={14.4378} zoom={13} />
				</div>
			</div>
		</section>
	)
}
