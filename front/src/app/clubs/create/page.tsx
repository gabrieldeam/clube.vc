"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClub } from "../../../services/club";
import { ClubCreate } from "../../../types/club";
import { listCategories } from "../../../services/category";
import { CategoryResponse } from "../../../types/category";

export default function CreateClubPage() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Busca as categorias ao carregar a página
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        setCategories(data);
        // Define a categoria padrão como a primeira, se houver
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clubData: ClubCreate = { name, category_id: categoryId };
      await createClub(clubData, logoFile || undefined);
      router.push("/clubs");
    } catch (err: any) {
      console.error("Erro ao criar clube:", err);
      setError("Erro ao criar clube");
    }
  };

  return (
    <div>
      <h1>Criar Clube</h1>
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
        <div>
          <label>Categoria:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Logo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setLogoFile(e.target.files[0]);
            }}
          />
        </div>
        <button type="submit">Criar Clube</button>
      </form>
    </div>
  );
}
