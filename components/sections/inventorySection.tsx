import { Car } from '@/lib/cars'
import CarCard from '../carCard'

interface props{
	Cars:Car[]
}
export default function InventorySection({Cars}:props){
return(
	<section className='px-8 py-20'>
		<div className='mx-auto'>
			<p className='mb-12 uppercase font-semibold text-muted-foreground'>Showing {Cars.length} vehicles</p>
			<div className='grid grid-cols-3 gap-10'>
				{Cars.map((car)=>(
					 <CarCard key={car.id} car = {car} />
				))}
			</div>
		</div>
	</section>
)
}