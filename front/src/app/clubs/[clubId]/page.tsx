"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopMenu from "@/components/TopMenu/TopMenu";
import { getClub, updateClub, listClubs, deleteClub } from "../../../services/club";
import { getCategory, listCategories } from "../../../services/category";
import { listSubscriptionPlans, createSubscriptionPlan } from "../../../services/subscriptionPlan";
import { ClubResponse } from "../../../types/club";
import { CategoryResponse } from "../../../types/category";
import {
  SubscriptionPlanResponse,
  SubscriptionPlanCreate,
  SubscriptionPlanBenefit,
} from "../../../types/subscriptionPlan";

import styles from "./ClubDetail.module.css";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function ClubDetailPage() {
  const { clubId } = useParams() as { clubId: string };
  const router = useRouter();

  // Dados do clube e categoria (exibidos no cabeçalho)
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [clubCategory, setClubCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Controle dos tabs:
  // "details" | "plans" | "createPlan" | "editClub" | "estilo" | "blog" | "grupoConversas" | "engajamentos"
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

  // Dados dos planos de assinatura
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Estados para criação de novo plano
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPrice, setPlanPrice] = useState(0);
  const [planBenefits, setPlanBenefits] = useState<SubscriptionPlanBenefit[]>([]);
  const [benefitText, setBenefitText] = useState("");

  // Estados para edição do clube (aba "editClub")
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number>(0);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editCategories, setEditCategories] = useState<CategoryResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para listar clubes no select do header
  const [clubsList, setClubsList] = useState<ClubResponse[]>([]);

  // Estado para dropdown de opções
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  // Ref para o dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para modal de confirmação para exclusão (permanece modal)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

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

  // Carrega dados do clube
  useEffect(() => {
    async function fetchClub() {
      try {
        const data = await getClub(clubId);
        setClub(data);
      } catch (error) {
        console.error("Erro ao buscar clube:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [clubId]);

  // Carrega categoria do clube (para exibição no cabeçalho)
  useEffect(() => {
    async function fetchCategory() {
      if (club && club.category_id) {
        try {
          const data = await getCategory(club.category_id);
          setClubCategory(data);
        } catch (error) {
          console.error("Erro ao buscar categoria:", error);
        }
      }
    }
    fetchCategory();
  }, [club]);

  // Carrega a lista de clubes para o select do header
  useEffect(() => {
    async function fetchClubs() {
      try {
        const data = await listClubs();
        setClubsList(data);
      } catch (error) {
        console.error("Erro ao listar clubes:", error);
      }
    }
    fetchClubs();
  }, []);

  // Ao entrar na aba de assinaturas, carrega os planos
  useEffect(() => {
    if (activeTab === "plans") {
      async function fetchPlans() {
        setPlansLoading(true);
        try {
          const data = await listSubscriptionPlans(clubId);
          setPlans(data);
        } catch (error) {
          console.error("Erro ao listar planos:", error);
        } finally {
          setPlansLoading(false);
        }
      }
      fetchPlans();
    }
  }, [activeTab, clubId]);

  // Ao entrar na aba de edição, inicializa os estados com os dados do clube e carrega as categorias
  useEffect(() => {
    if (activeTab === "editClub" && club) {
      setEditName(club.name);
      setEditCategoryId(club.category_id);
      async function fetchCategories() {
        try {
          const data = await listCategories();
          setEditCategories(data);
        } catch (error) {
          console.error("Erro ao carregar categorias:", error);
        }
      }
      fetchCategories();
    }
  }, [activeTab, club]);

  // Funções do formulário de criação de plano
  const handleAddBenefit = () => {
    if (benefitText.trim()) {
      setPlanBenefits((prev) => [...prev, { benefit: benefitText }]);
      setBenefitText("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setPlanBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planData: SubscriptionPlanCreate = {
        club_id: clubId,
        name: planName,
        description: planDescription,
        price: planPrice,
        benefits: planBenefits,
      };
      await createSubscriptionPlan(planData);
      const updatedPlans = await listSubscriptionPlans(clubId);
      setPlans(updatedPlans);
      setPlanName("");
      setPlanDescription("");
      setPlanPrice(0);
      setPlanBenefits([]);
      setBenefitText("");
      setActiveTab("plans");
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
  };

  // Funções para edição do clube
  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditLogoFile(e.target.files[0]);
    }
  };

  const handleEditDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setEditLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpdateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClub(clubId, { name: editName, category_id: editCategoryId }, editLogoFile || undefined);
      const updatedClub = await getClub(clubId);
      setClub(updatedClub);
      setActiveTab("details");
    } catch (error) {
      console.error("Erro ao atualizar clube:", error);
    }
  };

  // Função para excluir clube
  const handleDeleteClub = async () => {
    try {
      await deleteClub(clubId);
      router.push("/clubs");
    } catch (error) {
      console.error("Erro ao excluir clube:", error);
    }
  };

  // Lida com a seleção de outro clube no select do header
  const handleClubSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClubId = e.target.value;
    if (selectedClubId) {
      router.push(`/clubs/${selectedClubId}`);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado.</p>;

  return (
    <>
      <TopMenu />
      <div className={styles.pageContainer}>
        {/* Cabeçalho Grande */}
        <header className={styles.headerInfo}>
          <div className={styles.leftHeader}>
            {club.logo && (
              <img src={`${backendUrl}${club.logo}`} alt={club.name} className={styles.clubLogo} />
            )}
            <div className={styles.clubData}>
              <h1 className={styles.clubName}>{club.name}</h1>
              <p className={styles.clubCategory}>
                {clubCategory ? clubCategory.name : `ID ${club.category_id}`}
              </p>
              <p className={styles.clubId}>ID: {club.id}</p>
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
                    >
                      Excluir Clube
                    </button>
                  </li>
                  <li>
                    <Link href="/clubs/create">
                      <button onClick={() => setShowOptionsDropdown(false)}>Criar Clube</button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Layout com Menu Lateral e Conteúdo Centralizado */}
        <div className={styles.contentContainer}>
          <aside className={styles.sidebar}>
            <nav className={styles.sideNav}>
              <ul>
                <li>
                  <button onClick={() => setActiveTab("details")} className={activeTab === "details" ? styles.active : ""}>
                    Detalhes
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("plans")} className={activeTab === "plans" ? styles.active : ""}>
                    Assinaturas
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("createPlan")} className={activeTab === "createPlan" ? styles.active : ""}>
                    Criar Plano
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("editClub")} className={activeTab === "editClub" ? styles.active : ""}>
                    Editar Clube
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("estilo")} className={activeTab === "estilo" ? styles.active : ""}>
                    Estilo
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
            {activeTab === "details" && (
              <section className={styles.tabSection}>
                <h2>Detalhes do Clube</h2>
                <p>Aqui estão as informações gerais do clube.</p>
              </section>
            )}

            {activeTab === "plans" && (
              <section className={styles.tabSection}>
                <h2>Planos de Assinatura</h2>
                {plansLoading ? (
                  <p>Carregando planos...</p>
                ) : plans.length === 0 ? (
                  <p>Nenhum plano encontrado.</p>
                ) : (
                  <ul className={styles.plansList}>
                    {plans.map((plan) => (
                      <li key={plan.id} className={styles.planItem}>
                        <strong>{plan.name}</strong> - R$ {plan.price.toFixed(2)}
                        <p>{plan.description}</p>
                        {plan.benefits?.length && (
                          <ul className={styles.benefitsList}>
                            {plan.benefits.map((b, idx) => (
                              <li key={idx}>{b.benefit}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {activeTab === "createPlan" && (
              <section className={styles.tabSection}>
                <h2>Criar Novo Plano</h2>
                <form id="createPlanForm" onSubmit={handleCreatePlan} className={styles.planForm}>
                  <div className={styles.formGroup}>
                    <label>Nome do Plano:</label>
                    <input
                      type="text"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Descrição:</label>
                    <textarea
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      required
                      className={styles.textareaField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preço (R$):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(Number(e.target.value))}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Benefícios:</label>
                    <div className={styles.benefitInputGroup}>
                      <input
                        type="text"
                        value={benefitText}
                        onChange={(e) => setBenefitText(e.target.value)}
                        className={styles.inputField}
                      />
                      <button type="button" onClick={handleAddBenefit} className={styles.addButton}>
                        Adicionar
                      </button>
                    </div>
                    {planBenefits.map((b, idx) => (
                      <div key={idx} className={styles.benefitItem}>
                        <span>{b.benefit}</span>
                        <button type="button" onClick={() => handleRemoveBenefit(idx)} className={styles.removeButton}>
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </form>
              </section>
            )}

            {activeTab === "editClub" && (
              <section className={styles.tabSection}>
                <h2>Editar Clube</h2>
                <form id="editClubForm" onSubmit={handleUpdateClub} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>Nome:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categoria:</label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(Number(e.target.value))}
                      required
                      className={styles.inputField}
                    >
                      {editCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.fileUploadSection}>
                    <label>Logo:</label>
                    <div
                      className={styles.fileUploadContainer}
                      onDragOver={handleEditDragOver}
                      onDrop={handleEditDrop}
                    >
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
                        onChange={handleEditFileSelect}
                      />
                    </div>
                    <p className={styles.fileUploadHint}>
                      A imagem deve estar em JPG ou PNG, até 5 MB. Dimensões ideais: 600x600 pixels.
                    </p>
                  </div>
                </form>
              </section>
            )}

            {activeTab === "estilo" && (
              <section className={styles.tabSection}>
                <h2>Estilo</h2>
              </section>
            )}

            {activeTab === "blog" && (
              <section className={styles.tabSection}>
                <h2>Blog</h2>
              </section>
            )}

            {activeTab === "grupoConversas" && (
              <section className={styles.tabSection}>
                <h2>Grupo de Conversa</h2>
              </section>
            )}

            {activeTab === "engajamentos" && (
              <section className={styles.tabSection}>
                <h2>Engajamentos</h2>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Fixed Footer para as seções "Criar Plano" e "Editar Clube" */}
      {(activeTab === "createPlan" || activeTab === "editClub") && (
        <div className={styles.fixedFooter}>
          {activeTab === "createPlan" && (
            <button type="submit" form="createPlanForm" className={styles.fixedButton}>
              Criar Plano
            </button>
          )}
          {activeTab === "editClub" && (
            <button type="submit" form="editClubForm" className={styles.fixedButton}>
              Atualizar Clube
            </button>
          )}
        </div>
      )}

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
