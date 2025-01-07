'use server'
import { InventoryItem, SalesRecord } from "@/src/types/types";
import { getXataClient } from "@/src/xata";

const xata = getXataClient();

export async function getStock() {
    const stock = await xata.db.stockTable.getAll();
    return stock;
}

export async function createProd(data: { name: string; quantity: number; price: number; category: string }) {
    try {
        const stock = await xata.db.stockTable.create(data);
        return stock;
    } catch (error) {
        console.error("Error creando el producto en la base de datos:", error);
        throw error;
    }
}

export async function deleteProd(xata_id: string) {
    try {
        const stock = await xata.db.stockTable.delete({ xata_id });
        return stock;
    } catch (error) {
        console.error("Error eliminando el producto en la base de datos:", error);
        throw new Error('No se pudo eliminar el producto.');
    }
}

export const updateProd = async (xata_id: string, updatedFields: Partial<InventoryItem>) => {
    try {
      const currentProduct = await xata.db.stockTable.read(xata_id);
      const updatedProduct = {
        ...currentProduct,
        ...updatedFields,
        salesCount: currentProduct?.salesCount ?? 0,
        totalSold: currentProduct?.totalSold ?? 0
      };
  
      const result = await xata.db.stockTable.update(xata_id, updatedProduct);
      return result;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

export async function getCategories() {
    const categories = await xata.db.categoryTable.getAll();
    return categories;
}

export async function createCategory(name: string) {
    const newCategory = await xata.db.categoryTable.create({ name });
    return newCategory;
}

export async function deleteCategory(id: string) {
    await xata.db.categoryTable.delete(id);
}

export async function updateProductSellCount(xata_id: string, quantity: number) {
    try {
        const product = await xata.db.stockTable.read(xata_id);

        if (product) {
            const currentSales = typeof product.salesCount === 'number' ? product.salesCount : 0;

            await xata.db.stockTable.update({
                xata_id,
                salesCount: currentSales + quantity,
            });
        }
    } catch (error) {
        console.error('Error updating product sell count:', error);
        throw error;
    }
}

export async function updateProductTotalSold(xata_id: string, quantity: number, price: number) {
    try {
        const product = await xata.db.stockTable.read(xata_id);

        if (product) {
            const currentTotalSold = typeof product.totalSold === 'number' ? product.totalSold : 0;
            const saleAmount = quantity * price;

            await xata.db.stockTable.update({
                xata_id,
                totalSold: currentTotalSold + saleAmount,
            });
        }
    } catch (error) {
        console.error('Error updating total sold:', error);
        throw error;
    }
}

export async function getSalesData() {
    try {
        const data = await xata.db.stockTable
            .select(['xata_id', 'name', 'salesCount', 'price', 'totalSold'])
            .getAll();

        return data.map(item => ({
            xata_id: item.xata_id,
            name: item.name || 'Sin nombre',
            salesCount: typeof item.salesCount === 'number' ? item.salesCount : 0,
            price: typeof item.price === 'number' ? item.price : 0,
            totalSold: typeof item.totalSold === 'number' ? item.totalSold : 0,
        }));
    } catch (error) {
        console.error('Error getting sales data:', error);
        throw error;
    }
}

export const recordSale = async (productName: string, quantity: number, price: number) => {
    const saleRecord = {
      date: new Date().toISOString(),
      "totalPrice ": price * quantity,
      "productName ": productName,
      "quantity ": quantity,
    };
    try {
      const response = await xata.db.sales.create(saleRecord);
      console.log('Respuesta de Xata:', JSON.stringify(response));
      return { success: true, message: 'Venta registrada exitosamente' };
    } catch (error) {
      console.error('Error registrando venta:', error);
      if (error instanceof Error) {
        console.error('Detalles del error:', error.message);
      }
      return { success: false, message: 'Error al registrar la venta' };
    }
  };

export async function getTotalSalesData(): Promise<Array<{ month: string; totalSales: number }>> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
      const salesData = await xata.db.sales
          .filter({ date: { $ge: sixMonthsAgo } })
          .select(['xata_id', 'date', 'productName ', 'quantity ', 'totalPrice '])
          .getAll();

      const mappedSalesData = salesData.map(item => ({
          xata_id: item.xata_id,
          date: item.date ? new Date(item.date).toISOString() : null,
          productName: item["productName "],
          quantity: item['quantity '],
          totalPrice: item['totalPrice '] ?? 0,
      })) as SalesRecord[];

      const monthlyData = mappedSalesData.reduce((acc: Record<string, number>, item) => {
          const saleDate = new Date(item.date);
          if (isNaN(saleDate.getTime())) {
              console.warn('Invalid date detected:', item.date);
              return acc;
          }

          const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
          acc[monthKey] = (acc[monthKey] || 0) + item.totalPrice;
          return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, totalSales]) => ({
          month,
          totalSales,
      }));
  } catch (error) {
      console.error('Error fetching total sales data:', error);
      throw error;
  }
}

export async function getLatestSales() {
    try {
      const latestSales = await xata.db.sales
        .select(['xata_id', 'date', 'productName ', 'quantity ', 'totalPrice '])
        .sort('date', 'desc')
        .getMany({ pagination: { size: 10 } });
  
      return latestSales.map((sale) => ({
        id: sale.xata_id,
        date: sale.date ? new Date(sale.date).toLocaleString() : 'N/A',
        productName: sale["productName "] || 'N/A',
        quantity: sale["quantity "] || 0,
        totalPrice: sale["totalPrice "] || 0,
      }));
    } catch (error) {
      console.error('Error fetching latest sales:', error);
      throw error;
    }
  }
