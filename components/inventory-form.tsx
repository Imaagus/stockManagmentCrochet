'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'

type InventoryItem = {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
}

type InventoryFormProps = {
  onSubmit: (item: Omit<InventoryItem , 'xata_id'>) => void
  initialData?: InventoryItem | null 
}

export function InventoryForm({ onSubmit, initialData }: InventoryFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')


  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setQuantity(initialData.quantity.toString())
      setPrice(initialData.price.toString())
      setCategory(initialData.category)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) {
      toast({
        title: "Error",
        description: "Debe asignar una categoria.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      category,
    })
    setName('')
    setQuantity('')
    setPrice('')
    setCategory('')
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
        <div className="w-full p-4">
        <Label htmlFor="category">Categoria</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger  className="w-full">
            <SelectValue  />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Moto Cub">Moto Cub</SelectItem>
            <SelectItem value="Moto Street">Moto Street</SelectItem>
            <SelectItem value="Motocross">Motocross</SelectItem>
            <SelectItem value="Moto Deportiva">Moto Deportiva</SelectItem>
            <SelectItem value="Scooter">Scooter</SelectItem>
          </SelectContent>
        </Select>
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

