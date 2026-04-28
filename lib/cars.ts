export interface Car {
  id: string
  name: string
  brand: string
  year: number
  price: number
  
  image?: string
  featured?: boolean
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
