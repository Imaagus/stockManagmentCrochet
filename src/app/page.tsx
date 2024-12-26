'use client'

import { Inventory } from "@/components/inventory"
import { useInventory } from "./inventoryContext"
import { Spinner } from "@/components/ui/spinner"

export default function InventoryPage() {
  const { items, isLoading } = useInventory()

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div>
      <Inventory stock={items} />
    </div>
  )
}

