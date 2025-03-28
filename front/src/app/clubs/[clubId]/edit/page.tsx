"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClub, updateClub } from "../../../../services/club";
import { listCategories } from "../../../../services/category";
import { ClubResponse, ClubUpdate } from "../../../../types/club";
import { CategoryResponse } from "../../../../types/category";

export default function EditClubPage() {
  const { clubId } = useParams() as { clubId: string };
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Busca os dados do clube
  useEffect(() => {
    async function fetchClub() {
      try {
        const data = await getClub(clubId);
        setClub(data);
        setName(data.name);
        setCategoryId(data.category_id);
      } catch (error) {
        console.error("Erro ao buscar clube:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [clubId]);

  // Busca as categorias para preencher o select
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clubData: ClubUpdate = { name, category_id: categoryId };
      await updateClub(clubId, clubData, logoFile || undefined);
      router.push(`/clubs/${clubId}`);
    } catch (error) {
      console.error("Erro ao atualizar clube:", error);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado</p>;

  return (
    <div>
      <h1>Editar Clube</h1>
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
        <button type="submit">Atualizar Clube</button>
      </form>
    </div>
  );
}
