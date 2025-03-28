// app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listCategories, deleteCategory } from "../../../services/category";
import { CategoryResponse } from "../../../types/category";
import { useRouter } from "next/navigation";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (confirm("Deseja excluir esta categoria?")) {
        await deleteCategory(id);
        fetchCategories();
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  if (loading) return <p>Carregando categorias...</p>;

  return (
    <div>
      <h1>Gerenciar Categorias</h1>
      <Link href="/admin/categories/create">
        <button>Criar Nova Categoria</button>
      </Link>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} style={{ margin: "1rem 0" }}>
            {cat.name}{" "}
            <Link href={`/admin/categories/${cat.id}/edit`}>
              <button>Editar</button>
            </Link>
            <button onClick={() => handleDelete(cat.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
