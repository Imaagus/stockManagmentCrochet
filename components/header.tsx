import Link from "next/link";
import { ModeToggle } from "./mode-toggle";


export default function Header (){
    return(
        <nav className="w-full h-24 border-b bg-purple-100 dark:bg-zinc-900">
        <div  className="container mx-auto px-4 pt-8 flex justify-between items-center">
          <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Inventario</h1>
          <span className="text-sm">
            Bienvenida Andrea
          </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" >
              Inicio
            </Link>
            <Link href="/sales" >
              Ventas
            </Link>
            <ModeToggle/>
          </div>
        </div>
        </nav>
    )
}