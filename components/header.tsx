
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";



export default function Header (){


    return(
        <nav className="w-full h-24 border-b bg-zinc-100 dark:bg-zinc-900">
        <div  className="container mx-auto px-4 pt-8 flex justify-between items-center">
          <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Inventario</h1>
          <span className="text-sm">
            Bienvenida Andrea
          </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle/>
            <Link href="/sales" >
              <Button variant="default">Ventas</Button>
            </Link>
            <Link href="/" >
              <Button variant="default">Inicio</Button>
            </Link>
          </div>
        </div>
        </nav>
    )
}