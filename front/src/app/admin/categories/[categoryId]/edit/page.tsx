// app/admin/categories/[categoryId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategory, updateCategory } from "@/services/category";
import { CategoryResponse, CategoryUpdate } from "@/types/category";

export default function EditCategoryPage() {
  const { categoryId } = useParams() as { categoryId: string };
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const data: CategoryResponse = await getCategory(parseInt(categoryId));
        setName(data.name);
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);
        setError("Erro ao carregar categoria");
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: CategoryUpdate = { name };
      await updateCategory(parseInt(categoryId), updateData);
      router.push("/admin/categories");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      setError("Erro ao atualizar categoria");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Editar Categoria</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
}
