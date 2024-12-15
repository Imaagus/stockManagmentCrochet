import { Inventory } from "@/components/inventory"
import {  getStock } from "@/utils/activity"

type InventoryItem = {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
  salesCount: number
  totalSold: number
}
export default async function InventoryPage() {

  const stockData  = await getStock();
  
  const stock: InventoryItem[] = stockData.map(item => ({
    xata_id: item.xata_id,
    name: item.name || '', 
    quantity: item.quantity || 0,
    price: item.price || 0,
    category: item.category || '',
    salesCount: item.salesCount || 0,
    totalSold: item.totalSold || 0
  }));

    return (
    <div>
      <Inventory stock={stock} />
    </div>
  )
}

