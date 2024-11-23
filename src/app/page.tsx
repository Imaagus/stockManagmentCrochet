import { Inventory } from "@/components/inventory"
import { getStock } from "@/utils/activity"


export default async function InventoryPage() {
  const stock = await getStock()
  console.log(stock)
  return (
    <div className="container mx-auto p-4">
      <Inventory stock={stock}/>
    </div>
  )
}

