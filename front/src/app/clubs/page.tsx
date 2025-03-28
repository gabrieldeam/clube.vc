"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listClubs } from "../../services/club";
import { listCategories } from "../../services/category";
import { ClubResponse } from "../../types/club";
import { CategoryResponse } from "../../types/category";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchClubs() {
      try {
        const data = await listClubs();
        setClubs(data);
      } catch (error) {
        console.error("Erro ao buscar clubes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }
    fetchCategories();
  }, []);

  // Filtra os clubes conforme a categoria e a busca pelo nome
  const filteredClubs = clubs.filter((club) => {
    const matchesCategory = selectedCategory
      ? club.category_id === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? club.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Carregando clubes...</p>;

  return (
    <div>
      <h1>Seus Clubes</h1>
      <div style={{ marginBottom: "1rem" }}>
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar clube..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        {/* Select para filtrar por categoria */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value ? parseInt(value) : "");
          }}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Link href="/clubs/create">
        <button>Criar Clube</button>
      </Link>
      <ul>
        {filteredClubs.map((club) => (
          <li key={club.id} style={{ margin: "1rem 0" }}>
            {club.logo && (
              <img src={`${backendUrl}${club.logo}`} alt={club.name} width={50} />
            )}
            <span>{club.name}</span>
            <Link href={`/clubs/${club.id}`}>
              <button style={{ marginLeft: "1rem" }}>Entrar no Clube</button>
            </Link>
            <Link href={`/clubs/${club.id}/edit`}>
              <button style={{ marginLeft: "0.5rem" }}>Editar Clube</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
