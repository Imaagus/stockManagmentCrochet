'use client'

import { useState, useEffect, useCallback } from 'react'
import { SalesDashboard } from './sales-chart'
import { SalesTable } from './sales-table'
import { LatestSalesTable } from './latest-sales-table'
import { getStock } from '@/utils/activity'
import { InventoryItem } from '@/src/types/types'

export default function Dashboard() {
  const [products, setProducts] = useState<InventoryItem[]>([])
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const fetchProducts = useCallback(async () => {
    try {
      const stockData = await getStock()
      const inventoryItems: InventoryItem[] = stockData.map(item => ({
        xata_id: item.xata_id,
        name: item.name || '',
        quantity: item.quantity || 0,
        price: item.price || 0,
        category: item.category || '',
        salesCount: item.salesCount || 0,
        totalSold: item.totalSold || 0
      }))
      setProducts(inventoryItems)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleUpdateQuantity = useCallback((xata_id: string, newQuantity: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.xata_id === xata_id ? { ...product, quantity: newQuantity } : product
      )
    )
  }, [])

  const handleSaleComplete = useCallback(() => {
    setUpdateTrigger(prev => prev + 1)
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="space-y-8">
      <SalesDashboard key={updateTrigger} />
      <div className="w-10/12 mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Últimas Ventas</h2>
        <LatestSalesTable updateTrigger={updateTrigger} />
      </div>
      <SalesTable
        items={products}
        onUpdateQuantity={handleUpdateQuantity}
        onSaleComplete={handleSaleComplete}
      />
    </div>
  )
}

