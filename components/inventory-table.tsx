import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from './ui/input'
import { AlertCircle, Edit, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ExportData } from './export-data'
import { Badge } from './ui/badge'



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

export function InventoryTable ({ items, onEdit, onDelete }: InventoryTableProps) {
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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/50 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full md:w-64 bg-white border-border focus:border-primary focus:ring focus:ring-primary/20"
            />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48 bg-white border-border">
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
    <div className="bg-white/80 rounded-lg overflow-hidden shadow-sm">
    <Table>
      <TableHeader>
        <TableRow className="bg-card hover:bg-card/90">
          <TableHead className="font-semibold">Nombre</TableHead>
          <TableHead className="font-semibold">Cantidad</TableHead>
          <TableHead className="font-semibold">Precio</TableHead>            <TableHead className="font-semibold">Categoría</TableHead>
          <TableHead className="text-center font-semibold">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
            {filteredProducts.map((item, index) => (
              <TableRow key={item.xata_id} className={index % 2 === 0 ? 'bg-white' : 'bg-card/20'}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                <Badge variant={item.quantity > 10 ? 'default' : 'destructive'} className="bg-primary/10 text-black border-primary/20">
                    {item.quantity}
                  </Badge>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item)} 
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteClick(item)}
                      className="bg-delete/10 text-delete border-delete/20 hover:bg-delete/20">
                      <Trash2 className="h-4 w-4 mr-1" />
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
        <Alert variant="destructive" className="mt-6 bg-delete/10 border-delete/20 text-delete">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="ml-2 text-lg font-semibold">Confirmar eliminación</AlertTitle>
          <AlertDescription className="mt-2">
            ¿Estás seguro de que deseas eliminar <strong>{itemToDelete.name}</strong> del inventario?
          </AlertDescription>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelDelete} 
              className="bg-white text-muted border-border hover:bg-gray-50">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} 
              className="bg-delete text-white hover:bg-delete/90">
              Eliminar
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

