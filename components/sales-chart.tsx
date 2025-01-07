'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { getTotalSalesData } from '@/utils/activity'

const sortChartData = (data: { month: string; totalSales: number }[]) => {
  return data.sort((a, b) => {
    const [yearA, monthA] = a.month.split('-').map(Number);
    const [yearB, monthB] = b.month.split('-').map(Number);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });
};

export function SalesDashboard() {
  const [chartData, setChartData] = useState<{ month: string; totalSales: number }[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [averageSales, setAverageSales] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState<{ month: string; totalSales: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const salesData = await getTotalSalesData()
      const sortedSalesData = sortChartData(salesData);
      const total = sortedSalesData.reduce((sum, item) => sum + item.totalSales, 0)
      const average = sortedSalesData.length > 0 ? total / sortedSalesData.length : 0

      setChartData(sortedSalesData)
      setTotalSales(total)
      setAverageSales(average)
    } catch (error) {
      console.error("Error fetching sales data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleBarClick = (data: { month: string; totalSales: number }) => {
    setSelectedMonth(data)
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-10/12 mx-auto my-10 ${isLoading ? 'opacity-50' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
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
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleString('default', { month: 'short' });
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Bar 
                dataKey="totalSales" 
                fill="#53a4fa" 
                radius={[4, 4, 0, 0]}  
                barSize={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {selectedMonth && (
        <Card className="col-span-4 bg-blue-100">
          <CardHeader>
            <CardTitle>Total del Mes: {selectedMonth.month}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedMonth.totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

