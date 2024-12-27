'use client'

import { useEffect } from "react"
import Header from "@/components/header"
import { SalesTable } from "@/components/sales-table"
import { LowStockAlert } from "@/components/low-stock"
import { useInventory } from "../inventoryContext"
import { Spinner } from "@/components/ui/spinner"

export default function SalesPage() {
  const { items, isLoading, updateQuantity, refreshInventory } = useInventory()

  useEffect(() => {
    refreshInventory()
  }, [refreshInventory])
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div>
        <LowStockAlert products={items} threshold={3}/>
        <SalesTable items={items} onUpdateQuantity={updateQuantity}/>
      </div>
    </div>
  )
}

