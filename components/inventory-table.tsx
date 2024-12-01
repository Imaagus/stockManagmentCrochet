import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from './ui/input'
import { AlertCircle, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
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

type InventoryTableProps = {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: ( xata_id: string) => void
  onUpdateQuantity: (xata_id: string, newQuantity: number) => void
}

export function InventoryTable ({ items, onEdit, onDelete, onUpdateQuantity }: InventoryTableProps) {
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  const handleDeleteClick = (item: InventoryItem) => {
    console.log('Item to delete:', item); 
    setItemToDelete(item) 
  }
  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.xata_id); 
      setItemToDelete(null);
    } else {
      console.log('No item to delete');
    }
  }
  const cancelDelete = () => {
    setItemToDelete(null) 
  }

  const uniqueCategories = Array.from(new Set(items.map(item => item.category)))
  const filteredProducts = items.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === 'all' || product.category === categoryFilter)
  )

  return (
    <div>
    <div className="mb-4 flex space-x-2 justify-between">
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {uniqueCategories.map((category) => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ExportData products={items}/>
    </div>
    <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-lg transition-colors duration-500">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProducts.map(item => (
          <TableRow key={item.xata_id} className="hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors ">
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.price.toFixed(2)}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="flex justify-evenly">
              <div className="flex">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(item)}>
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(item)}>
                Eliminar
              </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
     {itemToDelete && (
      <Alert variant="destructive" className="mt-4">
        <div className="flex h-24 justify-between items-center">
          <AlertCircle className="h-8 w-8" />
          <div className="text-center">
            <AlertTitle>Confirmar eliminación</AlertTitle>
            <AlertDescription>
              ¿Estás seguro de que deseas eliminar <strong>{itemToDelete.name}</strong> del inventario?
            </AlertDescription>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="ghost" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Alert>
    )}
    </div>
  )
}

