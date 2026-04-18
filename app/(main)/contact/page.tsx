import ContactForm from '@/components/contact-form'
import InventoryHeader from '@/components/inventoryHeader'

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

			<div className='px-20 py-20'>
				<ContactForm />
			</div>
		</section>
	)
}
