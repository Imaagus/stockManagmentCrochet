'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getTotalSalesData } from '@/utils/activity'

export function SalesDashboard() {
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [averageSales, setAverageSales] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState<{ name: string; total: number } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const salesData = await getTotalSalesData()

      const data = salesData.map((item) => ({
        name: item.month, // Mes en formato MM/YYYY
        total: item.totalSales, // Total de ventas del mes
      }))

      const total = data.reduce((sum, item) => sum + item.total, 0)
      const average = data.length > 0 ? total / data.length : 0

      setChartData(data)
      setTotalSales(total)
      setAverageSales(average)
    }

    fetchData()
  }, [])

  // Función para manejar clics en el gráfico
  const handleBarClick = (data: { name: string; total: number }) => {
    setSelectedMonth(data)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-10/12 mx-auto my-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageSales.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ventas Mensuales Totales</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  handleBarClick(e.activePayload[0].payload)
                }
              }}
            >
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="total" fill="#53a4fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {selectedMonth && (
        <Card className="col-span-4 bg-blue-100">
          <CardHeader>
            <CardTitle>Total del Mes: {selectedMonth.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedMonth.total.toLocaleString()}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
