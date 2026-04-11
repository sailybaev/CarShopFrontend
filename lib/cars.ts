export interface Car {
  id: string
  name: string
  brand: string
  year: number
  price: number
  mileage: number
  transmission: "Automatic" | "Manual"
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid"
  image: string
  featured?: boolean
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Model S Plaid",
    brand: "Tesla",
    year: 2024,
    price: 89990,
    mileage: 1200,
    transmission: "Automatic",
    fuelType: "Electric",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    name: "M4 Competition",
    brand: "BMW",
    year: 2024,
    price: 74900,
    mileage: 3500,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    name: "911 Carrera",
    brand: "Porsche",
    year: 2023,
    price: 115000,
    mileage: 8200,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
    featured: true,
  },
  {
    id: "4",
    name: "GLE 450",
    brand: "Mercedes-Benz",
    year: 2024,
    price: 68500,
    mileage: 5100,
    transmission: "Automatic",
    fuelType: "Hybrid",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
  },
  {
    id: "5",
    name: "Q8 e-tron",
    brand: "Audi",
    year: 2024,
    price: 72400,
    mileage: 2800,
    transmission: "Automatic",
    fuelType: "Electric",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
  },
  {
    id: "6",
    name: "F-Type R",
    brand: "Jaguar",
    year: 2023,
    price: 98000,
    mileage: 12000,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
  },
]

export function getCarById(id: string): Car | undefined {
  return cars.find(car => car.id === id)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage) + " mi"
}
