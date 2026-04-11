import HeroSection from '@/components/sections/hero-section'
import RecomendationSection from '@/components/sections/recomendation-section'
import { cars } from '@/lib/cars'

export default function Home() {
  const topCars = cars.filter(car=>car.featured)
  return (
    <div className='flex flex-col'>
      <HeroSection/>
      <RecomendationSection cars={topCars}/>
      {/* <HeroSection />
      <FeaturedCarsSection />
      <WhyChooseUsSection />
      <CTASection /> */}
    </div>
  )
}