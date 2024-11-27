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
  