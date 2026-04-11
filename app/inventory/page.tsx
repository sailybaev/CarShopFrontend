import InventoryHeader from '@/components/inventoryHeader'
import InventorySection from '@/components/sections/inventorySection'
import { cars } from '@/lib/cars'

export const metadata = {
	title: 'Inventory',
	description: 'Hello'
}
export default function InventoryPage() {
	return (
		<>
			<InventoryHeader
				text1='Our Collection'
				text2='Vehicle Inventory'
				text3=' sxahgjbcjdnvfdbnjgd sxahgjbcjdnvfdbnjgd sxahgjbcjdnvfdbnjgd'
			/>
			<InventorySection Cars={cars} />
		</>
	)
}
