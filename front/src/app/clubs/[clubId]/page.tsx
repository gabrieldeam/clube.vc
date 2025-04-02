"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Componentes
import TopMenu from "@/components/TopMenu/TopMenu";
import DetailsSection from "@/components/secaoclub/Details/Details";
import PlansSection from "@/components/secaoclub/Plans/Plans";
import CreatePlanSection from "@/components/secaoclub/CreatePlan/CreatePlan";
import EditClubSection from "@/components/secaoclub/EditClub/EditClub";
import EstiloSection from "@/components/secaoclub/Estilo/Estilo";
import BlogSection from "@/components/secaoclub/Blog/Blog";
import GrupoConversasSection from "@/components/secaoclub/GrupoConversas/GrupoConversas";
import EngajamentosSection from "@/components/secaoclub/Engajamentos/Engajamentos";

// Serviços
import { getClub, listClubs, deleteClub } from "../../../services/club";
import { getCategory } from "../../../services/category";

// Tipos
import { ClubResponse } from "../../../types/club";
import { CategoryResponse } from "../../../types/category";

// CSS
import styles from "./ClubDetail.module.css";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function ClubDetailPage() {
  const { clubId } = useParams() as { clubId: string };
  const router = useRouter();

  // Dados básicos do clube
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [clubCategory, setClubCategory] = useState<CategoryResponse | null>(null);
  const [clubsList, setClubsList] = useState<ClubResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Controle de abas
  const [activeTab, setActiveTab] = useState<
    | "details"
    | "plans"
    | "createPlan"
    | "editClub"
    | "estilo"
    | "blog"
    | "grupoConversas"
    | "engajamentos"
  >("details");

  // Dropdown de opções e modal de exclusão
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para o menu lateral na versão mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Efeitos para carregar dados
  useEffect(() => {
    async function fetchClubData() {
      try {
        const data = await getClub(clubId);
        setClub(data);
        const categoryData = await getCategory(data.category_id);
        setClubCategory(categoryData);
      } catch (error) {
        console.error("Erro ao buscar clube:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAllClubs() {
      try {
        const data = await listClubs();
        setClubsList(data);
      } catch (error) {
        console.error("Erro ao listar clubes:", error);
      }
    }

    fetchClubData();
    fetchAllClubs();
  }, [clubId]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptionsDropdown(false);
      }
    }
    if (showOptionsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsDropdown]);

  // Handlers
  async function handleDeleteClub() {
    try {
      await deleteClub(clubId);
      router.push("/clubs");
    } catch (error) {
      console.error("Erro ao excluir clube:", error);
    }
  }

  function handleClubSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedClubId = e.target.value;
    router.push(`/clubs/${selectedClubId}`);
  }

  if (loading) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado.</p>;

  return (
    <>
      <TopMenu />
      <div className={styles.pageContainer}>
        {/* Cabeçalho */}
        <header className={styles.headerInfo}>
          <div className={styles.leftHeader}>
            {club.logo && (
              <img src={`${backendUrl}${club.logo}`} alt={club.name} className={styles.clubLogo} />
            )}
            <div className={styles.clubData}>
              <h1 className={styles.clubName}>{club.name}</h1>
              <div className={styles.clubDataCategoryId}>
                <p className={styles.clubCategory}>
                  {clubCategory ? clubCategory.name : `ID ${club.category_id}`}
                </p>
                <p className={styles.clubId}>ID: {club.support_id}</p>
              </div>
            </div>
          </div>
          <div className={styles.rightHeader}>
            <select className={styles.clubSelect} onChange={handleClubSelect} value={club.id}>
              {clubsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className={styles.optionsButton} onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}>
              &#8942;
            </button>
            {showOptionsDropdown && (
              <div ref={dropdownRef} className={styles.dropdown}>
                <ul className={styles.dropdownList}>
                  <li>
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        setShowConfirmDeleteModal(true);
                      }}
                      className={styles.deleteButton}
                    >
                      Excluir clube
                    </button>
                  </li>
                  <li>
                    <Link href="/clubs/create">
                      <button onClick={() => setShowOptionsDropdown(false)}>Criar clube</button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Botão de Toggle para o Menu Lateral na versão Mobile */}
        <div className={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span>Menu</span>
        </div>

        {/* Layout: Menu Lateral e Conteúdo */}
        <div className={styles.contentContainer}>
          <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ""}`}>
            <nav className={styles.sideNav}>
              <ul>
                <li>
                  <button onClick={() => setActiveTab("details")} className={activeTab === "details" ? styles.active : ""}>
                    Detalhes
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("editClub")} className={activeTab === "editClub" ? styles.active : ""}>
                    Informações básicas
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("plans")} className={activeTab === "plans" ? styles.active : ""}>
                    Assinaturas
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("createPlan")} className={activeTab === "createPlan" ? styles.active : ""}>
                    Planos de assinatura
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("estilo")} className={activeTab === "estilo" ? styles.active : ""}>
                    Aparecia do clube
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("blog")} className={activeTab === "blog" ? styles.active : ""}>
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("grupoConversas")} className={activeTab === "grupoConversas" ? styles.active : ""}>
                    Grupo de Conversa
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("engajamentos")} className={activeTab === "engajamentos" ? styles.active : ""}>
                    Engajamentos
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
          <main className={styles.mainContent}>
            {activeTab === "details" && <DetailsSection />}
            {activeTab === "plans" && <PlansSection />}
            {activeTab === "createPlan" && <CreatePlanSection clubId={clubId} />}
            {activeTab === "editClub" && <EditClubSection clubId={clubId} />}
            {activeTab === "estilo" && <EstiloSection clubId={clubId} />}
            {activeTab === "blog" && <BlogSection clubId={clubId} />}
            {activeTab === "grupoConversas" && <GrupoConversasSection />}
            {activeTab === "engajamentos" && <EngajamentosSection />}
          </main>
        </div>
      </div>

      {/* Modal de Confirmação para Exclusão */}
      {showConfirmDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este clube?</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowConfirmDeleteModal(false)}>Cancelar</button>
              <button
                onClick={() => {
                  setShowConfirmDeleteModal(false);
                  handleDeleteClub();
                }}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}