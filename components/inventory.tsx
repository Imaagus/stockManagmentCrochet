'use client'

import { useCallback, useEffect, useState } from 'react'
import { InventoryTable } from './inventory-table'
import { InventoryForm } from './inventory-form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createProd, deleteProd, getCategories, updateProd } from '@/utils/activity'

import CategoryManagement from './category-management'
import Header from './header'
import { Heart } from 'lucide-react'


type InventoryItem = {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
  salesCount: number
  totalSold: number
}


export function Inventory({stock} : { stock : InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(stock)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [showForm, setShowForm] = useState(false);

  const { toast } = useToast()

  
  const handleHideForm = () => {
    setShowForm(false);
    setEditingItem(null); 
  };

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await getCategories();
      fetchedCategories
        .map((cat) => cat.name)
        .filter((name): name is string => name != null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        await updateProd(updatedItem.xata_id, {
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
      <header  className="bg-card/50 border-b border-border/50">
        <Header/>  
      </header>
      <main className="container mx-auto p-4">
        <section>
        <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-muted mb-2">El crochet de Andrea</h2>
            <p className="text-muted-foreground">Sistema de Gestión de Inventario</p>
        </div>
        <div className="grid gap-8">
            <div className="bg-card/50 rounded-xl shadow-lg p-6">
              <InventoryTable 
                items={items} 
                onEdit={(item) => {
                  setEditingItem(item)
                  setShowForm(true)
                }}
                onDelete={deleteItem} 
                onUpdateQuantity={updateQuantity}
              />
              <div className="mt-6 flex justify-center">
                {!showForm && (
                  <Button
                    className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                    onClick={() => {
                      setEditingItem(null) 
                      setShowForm(true) 
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    Agregar Nuevo Producto
                  </Button>
                )}
              </div>
            </div>
              {showForm && (
                <div className="mt-6 bg-white/50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">
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
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={handleHideForm}
                      className="border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          <section className="mt-8">
            <CategoryManagement />
          </section>
        </section>
      </main>
    </div>
  )
}

