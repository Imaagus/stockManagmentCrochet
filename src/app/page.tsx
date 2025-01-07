'use client'

import { useEffect, useState } from "react"
import { Inventory } from "@/components/inventory"
import { useInventory } from "./inventoryContext"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export default function InventoryPage() {
  const { items, isLoading, refreshInventory } = useInventory()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        await refreshInventory()
      } catch (err) {
        console.error("Error refreshing inventory:", err)
        setError("No se pudo cargar el inventario. Por favor, intente de nuevo.")
      }
    }

    fetchInventory()
  }, [refreshInventory])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Inventory stock={items} />
    </div>
  )
}



