'use server'
import { getXataClient } from "@/src/xata";

const xata = getXataClient();

export async function getStock (){
    const stock = await xata.db.stock.getAll()
    return stock
}
