'use server'
import { getXataClient } from "@/src/xata";

const xata = getXataClient();

export async function getStock (){
    const stock = await xata.db.stockTable.getAll()
    console.log(stock)
    return stock
}
export async function createProd (data:{ name: string; quantity: number; price: number }){
    const stock = await xata.db.stockTable.create(data)
    return stock
}
