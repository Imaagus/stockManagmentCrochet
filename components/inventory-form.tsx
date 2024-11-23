'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InventoryItem = {
  id: number
  name: string
  quantity: number
  price: number
}

type InventoryFormProps = {
  onSubmit: (item: Omit<InventoryItem, 'id'>) => void
  initialData?: InventoryItem | null
}

export function InventoryForm({ onSubmit, initialData }: InventoryFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setQuantity(initialData.quantity.toString())
      setPrice(initialData.price.toString())
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    })
    setName('')
    setQuantity('')
    setPrice('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-col  ">
      <div className="flex justify-center">
        <div className="w-full p-4">
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="w-full p-4 ">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="w-full p-4">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="justify-self-center">
        <Button type="submit">
          {initialData ? 'Actualizar Producto' : 'Agregar Producto'}
        </Button>
      </div>
    </form>
  )
}

