'use client'

import { useState } from 'react'
import { InventoryTable } from './inventory-table'
import { InventoryForm } from './inventory-form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { InventoryItem } from '@/src/types/types'
import Header from './header'
import { Heart } from 'lucide-react'
import { useInventory } from '@/src/app/inventoryContext'

export function Inventory({ stock }: { stock: InventoryItem[] }) {
  const { updateProduct, refreshInventory, addProduct, removeProduct } = useInventory();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [showForm, setShowForm] = useState(false);
  
  const { toast } = useToast()

  const handleHideForm = () => {
    setShowForm(false);
    setEditingItem(null); 
  };

  const handleAddItem = async (item: Omit<InventoryItem, 'xata_id'>) => {
    try {
      await addProduct(item);
      await refreshInventory(); 
      toast({
        title: "Producto agregado",
        description: `El producto ${item.name} ha sido agregado al inventario.`,
      });
      handleHideForm();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el producto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateItem = async (updatedItem: InventoryItem) => {
    try {
      await updateProduct(updatedItem.xata_id, updatedItem);
      await refreshInventory();
      toast({
        title: "Producto actualizado",
        description: `El producto ${updatedItem.name} ha sido modificado.`,
      });
      setEditingItem(null);
      handleHideForm();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteItem = async (id: string) => {  
    try {
      await removeProduct(id);
      await refreshInventory(); 
      toast({
        title: "Producto Eliminado",
        description: "El producto ha sido eliminado",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card/50">
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
                items={stock} 
                onEdit={(item) => {
                  setEditingItem(item)
                  setShowForm(true)
                }}
                onDelete={handleDeleteItem} 
                onUpdateQuantity={(xata_id, newQuantity) => updateProduct(xata_id, { quantity: newQuantity })}
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
                      handleUpdateItem({ ...item, xata_id: editingItem.xata_id })
                    } else {
                      handleAddItem(item)
                    }
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
        </section>
      </main>
    </div>
  )
}

