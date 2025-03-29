"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { listClubs } from "../../services/club";
import { listCategories } from "../../services/category";
import { ClubResponse } from "../../types/club";
import { CategoryResponse } from "../../types/category";
import styles from "./ClubSection.module.css";

export default function ClubSection() {
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchClubs() {
      try {
        const data = await listClubs();
        setClubs(data);
      } catch (error) {
        console.error("Erro ao buscar clubes:", error);
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

  // Filtra os clubes conforme a categoria selecionada e a pesquisa
  const filteredClubs = clubs.filter((club) => {
    const matchesCategory = selectedCategory ? club.category_id === selectedCategory : true;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Se não houver nenhum clube, mostra 3 cards de criação;
  // Se houver 1, mostra 2; se houver 2 ou mais, exibe 1 permanente.
  const creationCardsCount = Math.max(3 - filteredClubs.length, 1);

  return (
    <div className={styles.clubSectionContainer}>
      {/* Cabeçalho com título, campo de busca e filtro por categoria */}
      <div className={styles.header}>
        <h1>Seus clubes</h1>
        <div>
          <input 
            type="text" 
            placeholder="Pesquisar clubes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value ? parseInt(value) : "");
            }}
            className={styles.categorySelect}
          >
            <option value="">Todos</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Clubes e Card(s) de Criação */}
      <div className={styles.clubsList}>
        {filteredClubs.map((club) => {
          const clubCategory = categories.find(
            (cat) => cat.id === club.category_id
          );
          return (
            <div key={club.id} className={styles.clubCard}>
              {/* Banner do Clube */}
              <div className={styles.banner}>
                <Image
                  src={
                    club.banner
                      ? `${backendUrl}${club.banner}`
                      : "/banner.svg"
                  }
                  alt="Banner do Clube"
                  width={460}
                  height={107}
                  className={styles.bannerImage}
                />
              </div>
              {/* Informações do Clube */}
              <div className={styles.clubInfo}>
                <div className={styles.logoAndDetails}>
                  {club.logo && (
                    <Image
                      src={`${backendUrl}${club.logo}`}
                      alt={club.name}
                      width={50}
                      height={50}
                      className={styles.clubLogo}
                    />
                  )}
                  <div className={styles.clubDetails}>
                    <h2 className={styles.clubName}>{club.name}</h2>
                    {clubCategory && (
                      <p className={styles.clubCategory}>{clubCategory.name}</p>
                    )}
                  </div>
                </div>
                <div className={styles.editButtonWrapper}>
                  <Link href={`/clubs/${club.id}`}>
                    <button className={styles.editButton}>Editar Clube</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Cards de Criação */}
        {Array.from({ length: creationCardsCount }).map((_, index) => (
          <div key={`creation-${index}`} className={styles.addClubCard}>
            <Link href="/clubs/create">
              <div className={styles.addClubContent}>
                <span className={styles.addClubText}>+ Adicionar clube</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
