import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from './ui/button'

type InventoryItem = {
    xata_id: string
    name: string
    quantity: number
    price: number
    category: string
  }
  
type InventoryTableProps = {
    items: InventoryItem[]
    onUpdateQuantity: (xata_id: string, newQuantity: number) => void
}
  
export function SalesTable ({items , onUpdateQuantity } : InventoryTableProps){
    const [saleQuantities, setSaleQuantities] = useState<Record<string, number | ''>>({}); 

    const handleInputChange = (xata_id: string, value: string) => {
        const quantity = parseInt(value, 10);
        setSaleQuantities({
          ...saleQuantities,
          [xata_id]: isNaN(quantity) ? '' : quantity,
        });
      };
    
      const handleSubmit = (item: InventoryItem) => {
        const saleQuantity = saleQuantities[item.xata_id];
        if (saleQuantity && saleQuantity > 0 && item.quantity >= saleQuantity) {
          onUpdateQuantity(item.xata_id, item.quantity - saleQuantity);
          setSaleQuantities({
            ...saleQuantities,
            [item.xata_id]: '', 
          });
          toast({
            title: 'Éxito',
            description: `Se han vendido ${saleQuantity} unidades de ${item.name}.`,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Debes indicar una cantidad válida o menor o igual al stock disponible.',
            variant: 'destructive',
          });
        }
      };
      const handleCancel = (xata_id: string) => {
        setSaleQuantities({
          ...saleQuantities,
          [xata_id]: '', 
        });
      };
    

    return(
        <div className="my-16">
        <h2 className="text-2xl my-4 text-center">Tabla de ventas</h2>
        <Table className="w-8/12 justify-self-center">
            <TableHeader>
                <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad de productos vendido</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
                <TableHead className="text-center">Total Vendido</TableHead>
                <TableHead className="text-center">Total recaudado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {items.map(item => (
            <TableRow key={item.xata_id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                    <input
                    type="number"
                    value={saleQuantities[item.xata_id] || ''}
                    onChange={(e) => handleInputChange(item.xata_id, e.target.value)}
                    placeholder="Cantidad"
                    className="border rounded p-2 w-24"
                    />
                </TableCell>
                <TableCell className="flex justify-evenly space-x-2">
                <Button
                  onClick={() => handleSubmit(item)}
                  className="px-4 py-2 rounded"
                  variant="default"
                >
                  Aceptar
                </Button>
                <Button
                  onClick={() => handleCancel(item.xata_id)}
                  className="px-4 py-2 rounded"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>$</TableCell>
            </TableRow>
             ))}               
            </TableBody>
        </Table>
        </div>
    )
}
//poner total de plata vendido en tal producto en la tablahead