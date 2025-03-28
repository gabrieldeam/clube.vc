"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getClub } from "../../../services/club";
import { getCategory } from "../../../services/category";
import { listSubscriptionPlans, createSubscriptionPlan } from "../../../services/subscriptionPlan";
import { subscribeToClub } from "../../../services/clubSubscription";
import { ClubResponse } from "../../../types/club";
import { CategoryResponse } from "../../../types/category";
import { SubscriptionPlanResponse, SubscriptionPlanCreate, SubscriptionPlanBenefit } from "../../../types/subscriptionPlan";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function ClubDetailPage() {
  const { clubId } = useParams() as { clubId: string };
  const router = useRouter();

  // Dados do clube e categoria
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Controle dos tabs: "details" | "plans" | "createPlan" | "subscribe"
  const [activeTab, setActiveTab] = useState<"details" | "plans" | "createPlan" | "subscribe">("details");

  // Dados dos planos de assinatura
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Estados para criação de novo plano
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPrice, setPlanPrice] = useState(0);
  const [planBenefits, setPlanBenefits] = useState<SubscriptionPlanBenefit[]>([]);
  const [benefitText, setBenefitText] = useState("");

  // Estado para feedback na assinatura
  const [subscribeMessage, setSubscribeMessage] = useState("");

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

  useEffect(() => {
    async function fetchCategory() {
      if (club && club.category_id) {
        try {
          const data = await getCategory(club.category_id);
          setCategory(data);
        } catch (error) {
          console.error("Erro ao buscar categoria:", error);
        }
      }
    }
    fetchCategory();
  }, [club]);

  // Busca os planos quando o usuário acessar a aba "plans" ou "subscribe"
  useEffect(() => {
    if (activeTab === "plans" || activeTab === "subscribe") {
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

  // Funções para o formulário de criação de plano
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
      // Atualiza a lista de planos
      const updatedPlans = await listSubscriptionPlans(clubId);
      setPlans(updatedPlans);
      // Limpa os campos do formulário
      setPlanName("");
      setPlanDescription("");
      setPlanPrice(0);
      setPlanBenefits([]);
      setBenefitText("");
      // Volta para a aba de planos
      setActiveTab("plans");
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
  };

  // Função para assinatura de um plano
  const handleSubscribe = async (planId: string) => {
    try {
      await subscribeToClub({ club_id: clubId, plan_id: planId });
      setSubscribeMessage("Assinatura realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao assinar:", error);
      setSubscribeMessage("Erro ao assinar o plano.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado.</p>;

  return (
    <div>
      <button onClick={() => router.back()}>Voltar</button>
      <h1>{club.name}</h1>
      {club.logo && (
        <img src={`${backendUrl}${club.logo}`} alt={club.name} width={100} />
      )}
      <p>ID: {club.id}</p>
      <p>Categoria: {category ? category.name : `ID ${club.category_id}`}</p>
      <div style={{ margin: "1rem 0" }}>
        <Link href={`/clubs/${club.id}/edit`}>
          <button>Editar Clube</button>
        </Link>
      </div>

      {/* Menu de navegação (tabs) */}
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("details")} disabled={activeTab === "details"}>
          Detalhes
        </button>
        <button onClick={() => setActiveTab("plans")} disabled={activeTab === "plans"}>
          Planos
        </button>
        <button onClick={() => setActiveTab("createPlan")} disabled={activeTab === "createPlan"}>
          Criar Plano
        </button>
        <button onClick={() => setActiveTab("subscribe")} disabled={activeTab === "subscribe"}>
          Assinar
        </button>
      </nav>

      {/* Conteúdo de cada aba */}
      {activeTab === "details" && (
        <div>
          <h2>Detalhes do Clube</h2>
          <p>Aqui estão as informações gerais do clube.</p>
          {/* Outras informações ou seções que desejar */}
        </div>
      )}

      {activeTab === "plans" && (
        <div>
          <h2>Planos de Assinatura</h2>
          {plansLoading ? (
            <p>Carregando planos...</p>
          ) : plans.length === 0 ? (
            <p>Nenhum plano encontrado.</p>
          ) : (
            <ul>
              {plans.map((plan) => (
                <li key={plan.id} style={{ marginBottom: "1rem" }}>
                  <strong>{plan.name}</strong> - R$ {plan.price.toFixed(2)}
                  <p>{plan.description}</p>
                  {plan.benefits?.length && (
                    <ul>
                      {plan.benefits.map((b, idx) => (
                        <li key={idx}>{b.benefit}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "createPlan" && (
        <div>
          <h2>Criar Novo Plano</h2>
          <form onSubmit={handleCreatePlan}>
            <div>
              <label>Nome do Plano:</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Descrição:</label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Preço (R$):</label>
              <input
                type="number"
                step="0.01"
                value={planPrice}
                onChange={(e) => setPlanPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Benefícios:</label>
              <div>
                <input
                  type="text"
                  value={benefitText}
                  onChange={(e) => setBenefitText(e.target.value)}
                />
                <button type="button" onClick={handleAddBenefit}>
                  Adicionar
                </button>
              </div>
              {planBenefits.map((b, idx) => (
                <div key={idx}>
                  <span>{b.benefit}</span>
                  <button type="button" onClick={() => handleRemoveBenefit(idx)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <button type="submit">Criar Plano</button>
          </form>
          <button onClick={() => setActiveTab("plans")}>Voltar aos Planos</button>
        </div>
      )}

      {activeTab === "subscribe" && (
        <div>
          <h2>Assinar o Clube</h2>
          {subscribeMessage && <p>{subscribeMessage}</p>}
          {plansLoading ? (
            <p>Carregando planos...</p>
          ) : plans.length === 0 ? (
            <p>Não há planos disponíveis para este clube.</p>
          ) : (
            <ul>
              {plans.map((plan) => (
                <li key={plan.id} style={{ marginBottom: "1rem" }}>
                  <strong>{plan.name}</strong> - R$ {plan.price.toFixed(2)}
                  <p>{plan.description}</p>
                  <button onClick={() => handleSubscribe(plan.id)}>
                    Assinar este plano
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => router.push("/clubs")}>Voltar para Lista de Clubes</button>
      </div>
    </div>
  );
}
