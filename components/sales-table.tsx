'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { updateProductSellCount, updateProductTotalSold , getSalesData} from '@/utils/activity'

interface Product {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
  salesCount: number
  totalSold: number
}


type SalesData = {
  xata_id: string
  name: string
  salesCount: number
  price: number
  totalSold: number
}

type SalesTableProps = {
  items: Product[]
  onUpdateQuantity: (xata_id: string, newQuantity: number) => void
}

export function SalesTable({ items, onUpdateQuantity }: SalesTableProps) {
  const [saleQuantities, setSaleQuantities] = useState<Record<string, number | ''>>({})
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const data = await getSalesData()
      setSalesData(data)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar los datos de ventas.',
        variant: 'destructive',
      })
    }
  }


  const handleInputChange = (xata_id: string, value: string) => {
    const quantity = parseInt(value, 10)
    setSaleQuantities({
      ...saleQuantities,
      [xata_id]: isNaN(quantity) ? '' : quantity,
    })
  }


  const handleSale = async (product: Product) => {
    const saleQuantity = saleQuantities[product.xata_id]
    if (typeof saleQuantity === 'number' && saleQuantity > 0 && product.quantity >= saleQuantity) {
      try {
        // Update sales count
        await updateProductSellCount(product.xata_id, saleQuantity)
        // Update total sold amount
        await updateProductTotalSold(product.xata_id, saleQuantity, product.price)
        // Update inventory quantity
        onUpdateQuantity(product.xata_id, product.quantity - saleQuantity)
        // Clear input
        setSaleQuantities(prev => ({ ...prev, [product.xata_id]: '' }))
        
        toast({
          title: 'Venta registrada',
          description: `Se han vendido ${saleQuantity} unidades de ${product.name}.`,
        })
        // Refresh data to show updated totals
        fetchSalesData()
      } catch (error) {
        console.error('Error registering sale:', error)
        toast({
          title: 'Error',
          description: 'No se pudo registrar la venta. Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Error',
        description: 'La cantidad de venta debe ser mayor que cero y no puede exceder el stock disponible.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6 bg-card/50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-muted">Registro de Ventas</h2>
      <div className="bg-white/80 rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card/30 hover:bg-card/40">
            <TableHead>Nombre</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Cantidad a Vender</TableHead>
            <TableHead className="text-center">Total Vendido</TableHead>
            <TableHead className="text-center">Total Recaudado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => {
            const salesItem = salesData.find(item => item.xata_id === product.xata_id)
            const totalSales = salesItem?.salesCount ?? 0
            const totalRevenue = salesItem?.totalSold ?? 0
            
            return (
              <TableRow key={product.xata_id}  className="hover:bg-card/10">
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max={product.quantity.toString()}
                    value={saleQuantities[product.xata_id] || ''}
                    onChange={(e) => handleInputChange(product.xata_id, e.target.value)}
                    className="w-20 bg-white border-border"
                  />
                </TableCell>
                <TableCell className="text-center">{totalSales}</TableCell>
                <TableCell className="text-center">${totalRevenue.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Button onClick={() => handleSale(product)}>
                    Registrar Venta
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}


//poner total de plata vendido en tal producto en la tablahead