"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import { SalesTable } from "@/components/sales-table";
import { toast } from "@/hooks/use-toast";
import { getStock, updateProd } from "@/utils/activity";
import { LowStockAlert } from "@/components/low-stock";

interface Product {
  xata_id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  salesCount: number;
  totalSold: number;
}

export default function SalesPage() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const stock = await getStock();
        const formattedStock: Product[] = stock.map((item) => ({
          xata_id: item.xata_id || "", 
          name: item.name || "Sin nombre",
          quantity: item.quantity || 0,
          price: item.price || 0,
          category: item.category || "Sin categoría",
          salesCount: item.salesCount || 0,
          totalSold: item.totalSold || 0,
        }));

        setItems(formattedStock);
      } catch (error) {
        console.error("Error al obtener el stock:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el inventario.",
          variant: "destructive",
        });
      }
    };
    fetchStock();
  }, []);

  const updateQuantity = async (xata_id: string, newQuantity: number) => {
    try {
      await updateProd(xata_id, { quantity: Math.max(0, newQuantity) });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.xata_id === xata_id
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <Header />
      <div className="w-8/12 justify-self-center">
      <LowStockAlert products={items} threshold={3}/>
      <SalesTable items={items} onUpdateQuantity={updateQuantity}/>
      </div>
    </div>
  );
}
