import { Inventory } from "@/components/inventory"
import { getStock } from "@/utils/activity"


export default async function InventoryPage() {
  const stock = await getStock()
  console.log(stock)
  return (
    <div>
      <Inventory stock={stock}/>
    </div>
  )
}

