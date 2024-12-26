'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getStock, updateProd, createProd, deleteProd } from '@/utils/activity'
import { InventoryItem } from '@/src/types/types'

type InventoryContextType = {
  items: InventoryItem[]
  isLoading: boolean
  updateQuantity: (xata_id: string, newQuantity: number) => Promise<void>
  refreshInventory: () => Promise<void>
  addProduct: (product: Omit<InventoryItem, 'xata_id'>) => Promise<void>
  removeProduct: (xata_id: string) => Promise<void>
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshInventory = useCallback(async () => {
    setIsLoading(true)
    try {
      const stock = await getStock()
      const formattedStock: InventoryItem[] = stock.map((item) => ({
        xata_id: item.xata_id || "",
        name: item.name || "Sin nombre",
        quantity: item.quantity || 0,
        price: item.price || 0,
        category: item.category || "Sin categoría",
        salesCount: item.salesCount || 0,
        totalSold: item.totalSold || 0,
      }))
      setItems(formattedStock)
    } catch (error) {
      console.error("Error al obtener el stock:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateQuantity = async (xata_id: string, newQuantity: number) => {
    try {
      await updateProd(xata_id, { quantity: Math.max(0, newQuantity) })
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.xata_id === xata_id
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
      )
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error)
    }
  }

  const addProduct = async (product: Omit<InventoryItem, 'xata_id'>) => {
    try {
      const newProduct = await createProd(product)
      setItems((prevItems) => [...prevItems, { ...product, xata_id: newProduct.xata_id }])
    } catch (error) {
      console.error("Error al agregar el producto:", error)
    }
  }

  const removeProduct = async (xata_id: string) => {
    try {
      await deleteProd(xata_id)
      setItems((prevItems) => prevItems.filter((item) => item.xata_id !== xata_id))
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
    }
  }

  useEffect(() => {
    refreshInventory()
  }, [refreshInventory])

  return (
    <InventoryContext.Provider value={{ 
      items, 
      isLoading, 
      updateQuantity, 
      refreshInventory, 
      addProduct, 
      removeProduct 
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

