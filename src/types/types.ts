export type InventoryItem = {
    xata_id: string
    name: string
    quantity: number
    price: number
    category: string
    salesCount: number
    totalSold: number
}

export type Product = InventoryItem
  
export type SalesData = {
    xata_id: string
    name: string
    salesCount: number
    price: number
    totalSold: number
  }

export interface Category {
    xata_id: string
    name: string
  }
  