'use server'
import { getXataClient } from "@/src/xata";

const xata = getXataClient();

export async function getStock (){
    const stock = await xata.db.stockTable.getAll()
    console.log(stock)
    return stock
}

export async function createProd(data: { name: string; quantity: number; price: number }) {
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
      throw new Error('No se pudo eliminar el producto.');  // Lanza un error más claro
    }
  }
  
  