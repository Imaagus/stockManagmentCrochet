'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getCategories, createCategory, deleteCategory } from '@/utils/activity';


interface Category {
  xata_id: string; 
  name: string;
}

export default function CategoryManagement() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      const mappedCategories: Category[] = fetchedCategories.map(category => ({
        xata_id: category.xata_id, 
        name: category.name ?? '', 

      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías.',
        variant: 'destructive',
      });
    }
  };

  const addCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory) {
      try {
        const newCat = await createCategory(trimmedCategory);
        const newCategoryFormatted: Category = {
          xata_id: newCat.xata_id,
          name: newCat.name ?? '', 

        };
        setCategories([...categories, newCategoryFormatted]);
        setNewCategory('');
        toast({
          title: 'Categoría agregada',
          description: `La categoría "${trimmedCategory}" ha sido añadida.`,
        });
      } catch (error) {
        console.error("Error adding category:", error);
        toast({
          title: 'Error',
          description: 'No se pudo agregar la categoría.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'El nombre de la categoría no puede estar vacío.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.xata_id !== id));
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría ha sido eliminada.',
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="space-y-4 w-8/12 justify-self-center ">
      <h2 className="text-2xl font-semibold">Gestión de Categorías</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={addCategory}>Agregar Categoría</Button>
      </div>
      <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-lg transition-colors duration-500">
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.xata_id}  className="hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors ">
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCategory(category.xata_id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

