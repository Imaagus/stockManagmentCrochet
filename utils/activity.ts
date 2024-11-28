'use server'
import { getXataClient } from "@/src/xata";

const xata = getXataClient();

export async function getStock (){
    const stock = await xata.db.stockTable.getAll()
    console.log(stock)
    return stock
}
export async function createProd(data: { name: string; quantity: number; price: number ; category: string}) {
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
  export async function updateProd(xata_id:string, data: Partial<{ name: string; quantity: number; price: number ; category: string }>) {
    try {
        const stock = await xata.db.stockTable.update(xata_id, data);
        return stock;
      } catch (error) {
        console.error("Error eliminando el producto en la base de datos:", error);
        throw new Error('No se pudo eliminar el producto.');  
      }
  }
  export async function getCategories() {
    const xata = getXataClient()
    const categories = await xata.db.categoryTable.getAll()
    return categories
  }
  
  export async function createCategory(name: string) {
    const xata = getXataClient()
    const newCategory = await xata.db.categoryTable.create({ name })
    return newCategory
  }
  
  export async function deleteCategory(id: string) {
    const xata = getXataClient()
    await xata.db.categoryTable.delete(id)
  }

  export async function updateProductSellCount(xata_id: string, quantity: number) {
    const xata = getXataClient()
    try {
      const product = await xata.db.stockTable.read(xata_id)
      
      if (product) {
        const currentSales = typeof product.salesCount === 'string' 
          ? parseInt(product.salesCount, 10) 
          : (product.salesCount ?? 0)
  
        await xata.db.stockTable.update({
          xata_id: xata_id,
          salesCount: currentSales + quantity
        })
      }
    } catch (error) {
      console.error('Error updating product sell count:', error)
      throw error
    }
  }
  export async function updateProductTotalSold(xata_id: string, quantity: number, price: number) {
    const xata = getXataClient()
    try {
      const product = await xata.db.stockTable.read(xata_id)
      
      if (product) {
        const currentTotalSold = product.totalSold ?? 0
        const saleAmount = quantity * price
        
        await xata.db.stockTable.update({
          xata_id: xata_id,
          totalSold: currentTotalSold + saleAmount
        })
      }
    } catch (error) {
      console.error('Error updating total sold:', error)
      throw error
    }
  }
  
  export async function getSalesData() {
    const xata = getXataClient()
    try {
      const data = await xata.db.stockTable.select([
        'xata_id', 
        'name', 
        'salesCount', 
        'price',
        'totalSold'
      ]).getAll()
      
      return data.map(item => ({
        xata_id: item.xata_id,
        name: item.name || 'Sin nombre',
        salesCount: typeof item.salesCount === 'number' ? item.salesCount : 0,
        price: typeof item.price === 'number' ? item.price : 0,
        totalSold: typeof item.totalSold === 'number' ? item.totalSold : 0
      }))
    } catch (error) {
      console.error('Error getting sales data:', error)
      throw error
    }
  }
