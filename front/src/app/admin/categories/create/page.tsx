// app/admin/categories/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "../../../../services/category";
import { CategoryCreate } from "../../../../types/category";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCategory: CategoryCreate = { name };
      await createCategory(newCategory);
      router.push("/admin/categories");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      setError("Erro ao criar categoria");
    }
  };

  return (
    <div>
      <h1>Criar Categoria</h1>
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
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}
