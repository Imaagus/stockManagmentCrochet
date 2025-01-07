'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getLatestSales } from '@/utils/activity'

interface Sale {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  totalPrice: number;
}

interface LatestSalesTableProps {
  updateTrigger: number;
}

export function LatestSalesTable({ updateTrigger }: LatestSalesTableProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true)
      try {
        const latestSales = await getLatestSales()
        setSales(latestSales)
      } catch (error) {
        console.error('Error fetching latest sales:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSales()
  }, [updateTrigger])

  return (
    <div className={`relative ${isLoading ? 'opacity-50' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <Table className="mt-20">
        <TableCaption>Las últimas 10 ventas realizadas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{sale.productName}</TableCell>
              <TableCell className="text-right">{sale.quantity}</TableCell>
              <TableCell className="text-right">${sale.totalPrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

