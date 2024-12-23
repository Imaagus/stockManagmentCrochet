import Link from "next/link";
import { RibbonIcon as Yarn, Home, ShoppingBag, Folder } from 'lucide-react';
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-card dark:bg-zinc-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <Image  
          src= "/logo.png"
          alt= "logo"
          width={75}
          height={75} 
          />
          <div>
            <h1 className="text-2xl font-bold text-accent">El Crochet de Andrea</h1>
            <p className="text-sm text-muted-foreground">Sistema de Gestión de Inventario</p>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </Link>
          <Link href="/sales" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <ShoppingBag className="h-4 w-4" />
            <span>Ventas</span>
          </Link>
          <Link href="/categorys" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <Folder className="h-4 w-4"/>
            <span>Categorias</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

