'use client'

import { useState } from 'react'
import { InventoryTable } from './inventory-table'
import { InventoryForm } from './inventory-form'
import { Button } from '@/components/ui/button'
import { useAuth, checkPermission } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { LoginForm } from './login-form'
import { ModeToggle } from './mode-toggle'
import { createProd, deleteProd } from '@/utils/activity'


type InventoryItem = {
  name: string
  quantity: number
  price: number
  xata_id: string
}


export function Inventory({stock}:{stock:any}) {
  const [items, setItems] = useState<InventoryItem[]>(stock)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const { toast } = useToast()
  const { user, login, logout } = useAuth()

  const addItem = async (item: Omit<InventoryItem, 'xata_id'>) => {
    try {
      const newProduct = await createProd(item);

       const newItem: InventoryItem = {
        ...item,
        xata_id: newProduct.xata_id,
      };

      setItems((prevItems) => [...prevItems, newItem]);
      toast({
        title: "Producto agregado",
        description: `El producto ${newProduct.name} ha sido agregado al inventario.`,
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el producto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  
  const updateItem =  (updatedItem: InventoryItem) => {
    setItems(items.map(item => item.xata_id === updatedItem.xata_id ? updatedItem : item));
    setEditingItem(null);
    toast({
      title: "Producto actualizado",
      description: `El producto ${updatedItem.name} ha sido modificado`,
    });
  };
  
  const deleteItem = async (id: string) => {  
    try{
      await deleteProd(id)
    }catch{
      console.log("error")
    }
    setItems(items.filter(item => item.xata_id != id)); 
    toast({
      title: "Producto Eliminado",
      description: "El producto ha sido eliminado",
    });
  };
  
  
  const updateQuantity = (id: string, newQuantity: number) => {
    setItems(items.map(item => 
      item.xata_id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
    toast({
      title:"Se ha actualizado la cantidad del producto"
    })
  }
  
  
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
              updateItem({ ...item, xata_id: editingItem.xata_id });
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

