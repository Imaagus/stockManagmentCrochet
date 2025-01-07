'use client'

import { useEffect } from "react"
import Header from "@/components/header"
import { LowStockAlert } from "@/components/low-stock"
import { useInventory } from "../inventoryContext"
import { Spinner } from "@/components/ui/spinner"
import Dashboard from "@/components/dashboard"

export default function SalesPage() {
  const { items, isLoading, refreshInventory } = useInventory()

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
      <Dashboard />
      <LowStockAlert products={items} threshold={0}/>

    </div>
  )
}

