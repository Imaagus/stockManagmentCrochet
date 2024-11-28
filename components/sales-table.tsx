'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { updateProductSellCount, getSalesData } from '@/utils/activity'

interface Product {
  xata_id: string
  name: string
  quantity: number
  price: number
  category: string
  salesCount: number
}


type SalesData = {
  xata_id: string
  name: string
  salesCount: number
  price: number
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
        await updateProductSellCount(product.xata_id, saleQuantity)
        onUpdateQuantity(product.xata_id, product.quantity - saleQuantity)
        setSaleQuantities(prev => ({ ...prev, [product.xata_id]: '' }))
        toast({
          title: 'Venta registrada',
          description: `Se han vendido ${saleQuantity} unidades de ${product.name}.`,
        })
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

  const calculateTotalRevenue = (product: Product, salesCount: number) => {
    return product.price * salesCount
  }

  return (
    <div className="my-16">
      <h2 className="text-2xl my-4 text-center">Tabla de ventas</h2>
      <Table>
        <TableHeader>
          <TableRow>
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
            const totalRevenue = calculateTotalRevenue(product, totalSales)
            
            return (
              <TableRow key={product.xata_id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max={product.quantity.toString()}
                    value={saleQuantities[product.xata_id] || ''}
                    onChange={(e) => handleInputChange(product.xata_id, e.target.value)}
                    className="w-20"
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
  )
}


//poner total de plata vendido en tal producto en la tablahead