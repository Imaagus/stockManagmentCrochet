'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getStock, updateProd, createProd, deleteProd } from '@/utils/activity'
import { InventoryItem } from '@/src/types/types'

type InventoryContextType = {
  items: InventoryItem[]
  isLoading: boolean
  updateProduct: (xata_id: string, updatedFields: Partial<InventoryItem>) => Promise<void>
  refreshInventory: () => Promise<void>
  addProduct: (product: Omit<InventoryItem, 'xata_id'>) => Promise<void>
  removeProduct: (xata_id: string) => Promise<void>
  lastUpdated: number
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
  const [lastUpdated, setLastUpdated] = useState(Date.now())

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
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error al obtener el stock:", error)
      throw error;
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProduct = async (xata_id: string, updatedFields: Partial<InventoryItem>) => {
    try {
      await updateProd(xata_id, updatedFields)
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.xata_id === xata_id
            ? { ...item, ...updatedFields }
            : item
        )
      )
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
      throw error;
    }
  }

  const addProduct = async (product: Omit<InventoryItem, 'xata_id'>) => {
    try {
      const newProduct = await createProd(product)
      setItems((prevItems) => [...prevItems, { ...product, xata_id: newProduct.xata_id }])
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error al agregar el producto:", error)
      throw error;
    }
  }

  const removeProduct = async (xata_id: string) => {
    try {
      await deleteProd(xata_id)
      setItems((prevItems) => prevItems.filter((item) => item.xata_id !== xata_id))
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      throw error;
    }
  }

  useEffect(() => {
    refreshInventory().catch((error) => {
      console.error("Error initial inventory load:", error)
      setIsLoading(false)
    })
  }, [refreshInventory])

  return (
    <InventoryContext.Provider value={{ 
      items, 
      isLoading, 
      updateProduct, 
      refreshInventory, 
      addProduct, 
      removeProduct,
      lastUpdated
    }}>
      {children}
    </InventoryContext.Provider>
  )
}



