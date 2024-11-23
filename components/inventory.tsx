'use client'

import { useState } from 'react'
import { InventoryTable } from './inventory-table'
import { InventoryForm } from './inventory-form'
import { Button } from '@/components/ui/button'
import { useAuth, checkPermission } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { LoginForm } from './login-form'
import { ModeToggle } from './mode-toggle'


type InventoryItem = {
  id: number
  name: string
  quantity: number
  price: number
}


export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Producto 1', quantity: 10, price: 100 },
    { id: 2, name: 'Producto 2', quantity: 15, price: 200 },
  ])
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const addItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now() }
    setItems([...items, newItem])
    toast({
      title:"Producto agregado",
      description:`El producto ${newItem.name} ha sido agregado al inventario`,
    })
  }

  const updateItem = (updatedItem: InventoryItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
    setEditingItem(null)
    toast({
      title:"Producto actualizado",
      description:`El producto ${updatedItem.name} ha sido modificado`
    })
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
    toast({
      title:"Producto Eliminado",
      description:`El producto ha sido eliminado`
    })
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
    toast({
      title:"Se ha actualizado la cantidad del producto"
    })
  }
  const { toast } = useToast()
  const { user, login, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Inventario</h1>
          <div className="flex items-center gap-4">
            <ModeToggle/>
            {user && (
              <span className="text-sm">
                Bienvenido, {user.username} ({user.role})
              </span>
            )}
            {user && <Button onClick={logout}>Cerrar sesión</Button>}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
      {!user? (
        <LoginForm onLogin={login}/>
      ): 
      <section>
      <InventoryTable 
        items={items} 
        onEdit={setEditingItem} 
        onDelete={deleteItem} 
        onUpdateQuantity={updateQuantity}
      />
        <section>
          <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            {editingItem ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <InventoryForm 
          onSubmit={(item) => {
            if (editingItem) {
              updateItem({ ...item, id: editingItem.id });
            } else {
              addItem(item);
            }
          }}
          initialData={editingItem}
        />
        </div>
        {editingItem && (
          <Button 
            className="mt-2" 
            variant="outline" 
            onClick={() => setEditingItem(null)}
          >
            Cancelar Edición
          </Button>
        )}
        </section>
      </section>
      }
      </main>
    </div>
  )
}

