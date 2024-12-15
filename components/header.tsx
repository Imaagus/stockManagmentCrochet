
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/utils";



export default function Header (){

    const { user, logout } = useAuth()

    return(
        <nav className="w-full h-24 border-b bg-zinc-100 dark:bg-zinc-900">
        <div  className="container mx-auto px-4 pt-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Inventario</h1>
          <div className="flex items-center gap-4">
            <ModeToggle/>
            <Link href="/sales" >
              <Button variant="default">Ventas</Button>
            </Link>
            <Link href="/" >
              <Button variant="default">Inicio</Button>
            </Link>
            {user && (
              <span className="text-sm">
                Bienvenido, {user.username} ({user.role})
              </span>
            )}
            {user && <Button onClick={logout}>Cerrar sesión</Button>}
          </div>
        </div>
        </nav>
    )
}