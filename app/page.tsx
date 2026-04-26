
import Footer from '@/components/footer'
import { Header } from '@/components/header'
import HeroSection from '@/components/sections/hero-section'
import RecomendationSection from '@/components/sections/recomendation-section'
// import { cars } from '@/lib/cars'

export default function Home() {
  // const topCars = cars.filter(car=>car.featured)
  return (
    <div className='flex flex-col'>
      <Header />
      <HeroSection/>
      {/* <RecomendationSection cars={topCars}/> */}
      <Footer />
      {/* <HeroSection />
      <FeaturedCarsSection />
      <WhyChooseUsSection />
      <CTASection /> */}
    </div>
  )
}