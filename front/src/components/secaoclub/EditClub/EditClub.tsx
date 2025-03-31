"use client";

import React, { useState, useEffect, useRef, FormEvent, DragEvent } from "react";
import { getClub, updateClub } from "@/services/club";
import { listCategories } from "@/services/category";
import { ClubResponse, ClubUpdate } from "@/types/club";
import { CategoryResponse } from "@/types/category";
import styles from "./EditClub.module.css";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface EditClubProps {
  clubId: string;
}

export default function EditClubSection({ clubId }: EditClubProps) {
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Carrega dados do clube
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

    // Carrega categorias
    async function fetchCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    fetchClub();
    fetchCategories();
  }, [clubId]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLogoFile(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const payload: ClubUpdate = { name, category_id: categoryId };
      await updateClub(clubId, payload, logoFile || undefined);
      alert("Clube atualizado com sucesso!");
      // Se desejar, recarregue os dados ou redirecione
    } catch (error) {
      console.error("Erro ao atualizar clube:", error);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado.</p>;

  return (
    <div className={styles.editClubContainer}>
      <h2 className={styles.title}>Editar Clube</h2>
      <form onSubmit={handleSubmit} className={styles.editClubForm}>
        <div className={styles.contentFlex}>
          {/* Coluna Esquerda: Exibe a logomarca atual e a área de upload */}
          <div className={styles.leftColumn}>            
            <div className={styles.fileUploadSection}>
              <h2 className={styles.categoriesTitle}>Logomarca do seu clube</h2>
              <div
                className={styles.fileUploadContainer}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div>
                  {club.logo && (
                    <img
                      src={`${backendUrl}${club.logo}`}
                      alt={club.name}
                      className={styles.currentLogo}
                    />
                  )}
                </div>
                <div>
                  <div className={styles.dragArea}>Arraste o arquivo para cá</div>
                  <div className={styles.orText}>ou</div>
                  <button
                    type="button"
                    className={styles.selectFileButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar um arquivo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              <p className={styles.fileUploadHint}>
                A imagem deve estar em JPG ou PNG, até 5 MB. Dimensões ideais: 600x600 pixels.
              </p>
            </div>
          </div>
          {/* Coluna Direita: Edição do Nome e Listagem de Categorias */}
          <div className={styles.rightColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.inputLarge}
                required
              />
              <p className={styles.inputHint}>
                Esse nome será exibido em todos os locais da clube.vc.
              </p>
            </div>
            <div className={styles.categoriesSection}>
              <h2 className={styles.categoriesTitle}>Categorias</h2>
              <p className={styles.categoriesSubtitle}>
                É através dela que seus compradores encontrarão seu produto mais facilmente.
              </p>
              <div className={styles.categoriesList}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`${styles.categoryItem} ${
                      categoryId === cat.id ? styles.selected : ""
                    }`}
                    onClick={() => setCategoryId(cat.id)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className={styles.saveButton}>
          Atualizar Clube
        </button>
      </form>
    </div>
  );
}
