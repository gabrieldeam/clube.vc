"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClub } from "../../../services/club";
import { listCategories } from "../../../services/category";
import styles from "./CreateClub.module.css";
import TopMenu from "@/components/TopMenu/TopMenu";

export default function CreateClubPage() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clubData = { name, category_id: categoryId };
      await createClub(clubData, logoFile || undefined);
      router.push("/");
    } catch (err: any) {
      console.error("Erro ao criar clube:", err);
      setError("Erro ao criar clube");
    }
  };

  // Cria uma URL para exibir a imagem de preview (limpe a URL quando o componente for desmontado se necessário)
  const previewURL = logoFile ? URL.createObjectURL(logoFile) : null;

  return (
    <>
      <TopMenu />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <h1 className={styles.title}>Criar clube</h1>
            <p className={styles.subtitle}>Preencha os dados abaixo para criar seu clube.</p>
          </div>

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
                  className={`${styles.categoryItem} ${categoryId === cat.id ? styles.selected : ""}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.fileUploadSection}>
            <h2 className={styles.categoriesTitle}>Logomarca do seu clube</h2>
            <div
              className={styles.fileUploadContainer}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewURL && (
                <div className={styles.imagePreview}>
                  <img src={previewURL} alt="Preview" className={styles.previewImage} />
                </div>
              )}
              <div className={styles.dropArea}>
                <div className={styles.dragText}>Arraste o arquivo para cá</div>
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
              A imagem escolhida deve estar no formato JPG ou PNG e ter no máximo 5 MB de tamanho.
              Dimensões ideais: 600x600 pixels.
            </p>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.footer}>
            <Link href="/">
              <button type="button" className={styles.cancelButton}>
                Cancelar
              </button>
            </Link>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
