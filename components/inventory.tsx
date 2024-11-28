'use client'

import { useEffect, useState } from 'react'
import { InventoryTable } from './inventory-table'
import { InventoryForm } from './inventory-form'
import { Button } from '@/components/ui/button'
import { useAuth, checkPermission } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { LoginForm } from './login-form'
import { ModeToggle } from './mode-toggle'
import { createProd, deleteProd, getCategories, updateProd } from '@/utils/activity'
import { LowStockAlert } from './low-stock'
import { SalesTable } from './sales-table'
import CategoryManagement from './category-management'
import { ExportData } from './export-data'


type InventoryItem = {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
  salesCount: number
  totalSold: number
}


export function Inventory({stock}:{stock:any}) {
  const [items, setItems] = useState<InventoryItem[]>(stock)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([])

  const { toast } = useToast()
  const { user, login, logout } = useAuth()

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => {
    setShowForm(false);
    setEditingItem(null); 
  };


  
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      const categoryNames = fetchedCategories
        .map(cat => cat.name)
        .filter((name): name is string => name != null)
      setCategories(categoryNames)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías.",
        variant: "destructive",
      })
    }
  }

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
  
  
  const updateItem = async (updatedItem: InventoryItem) => {
    try{
      const item = await updateProd(updatedItem.xata_id, {
        name: updatedItem.name,
        quantity: updatedItem.quantity,
        price: updatedItem.price,
        category: updatedItem.category,
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.xata_id === updatedItem.xata_id ? { ...item, ...updatedItem } : item
        )
      );
      toast({
        title: "Producto actualizado",
        description: `El producto ${updatedItem.name} ha sido modificado.`,
      });
      setEditingItem(null);
    }catch{
      console.log("error")
    }
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
  
  const updateQuantity = async (xata_id: string, newQuantity: number) => {
    try {
      await updateProd(xata_id, { quantity: Math.max(0, newQuantity) });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.xata_id === xata_id
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  
  return (
    <div className="min-h-screen bg-background text-foreground">
       <header>
        <nav className="w-full h-24 border-b bg-zinc-100 dark:bg-zinc-900">
        <div  className="container mx-auto px-4 pt-8 flex justify-between items-center">
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
        </nav>
      </header>
      <main className="container mx-auto p-4">
      {!user? (
        <LoginForm onLogin={login}/>
      ): 
      <section>
      <h2 className="text-center text-2xl font-bold p-4">Inventario actual</h2>
      <LowStockAlert products={items} threshold={5}/>
      <InventoryTable 
          items={items} 
          onEdit={items => {
            setEditingItem(items)
            setShowForm(true)
          }}
          onDelete={deleteItem} 
          onUpdateQuantity={updateQuantity}
        />
        <section>
        <div className="justify-items-center">
          <div>
          {!showForm && (
                <Button
                  className="mt-4 justify-center"
                  variant="default"
                  onClick={() => {
                    setEditingItem(null) 
                    setShowForm(true) 
                  }}
                >
                  Agregar Nuevo Producto
                </Button>
              )}
          </div>
        </div>
            {showForm && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">
                  {editingItem ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>
                <InventoryForm
                  onSubmit={(item) => {
                    if (editingItem) {
                      updateItem({ ...item, xata_id: editingItem.xata_id })
                    } else {
                      addItem(item)
                    }
                    handleHideForm()
                  }}
                  initialData={editingItem}
                />
                <div className="justify-items-center">
                 <div>
                  <Button
                    className="mt-2"
                    variant="outline"
                    onClick={handleHideForm}
                  >
                    Cancelar
                  </Button>
                 </div>
                </div>
              </div>
            )}
        </section>
        <section>
          <SalesTable
          items={items} 
          onUpdateQuantity={updateQuantity}/>
        </section>
        <section>
            <CategoryManagement/>
        </section>
        <section>
          <ExportData products={items}/>
        </section>
      </section>
      }
      </main>
    </div>
  )
}

