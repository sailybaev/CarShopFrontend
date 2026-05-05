import EditListingForm from '@/components/editListingForm'

export default async function EditListingPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <EditListingForm listingId={id} />
}