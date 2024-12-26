'use client'

import { Button } from "@/components/ui/button"

import { Product } from "@/src/types/types"

interface ExportDataProps {
  products: Product[]
}

export function ExportData({ products }: ExportDataProps) {
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Quantity']
    const data = products.map(product => [product.xata_id, product.name, product.category, product.quantity])
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'inventory_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Button onClick={exportToCSV}>Exportar a CSV</Button>
  )
}
