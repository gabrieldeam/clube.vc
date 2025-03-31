"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  listSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "@/services/subscriptionPlan";
import {
  SubscriptionPlanResponse,
  SubscriptionPlanBenefit,
  SubscriptionPlanCreate,
} from "@/types/subscriptionPlan";
import styles from "./CreatePlan.module.css";

interface CreatePlanSectionProps {
  clubId: string;
}

export default function CreatePlanSection({ clubId }: CreatePlanSectionProps) {
  // Modo de visualização: "list" para exibição da listagem, "create" para criação e "edit" para edição.
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  // Estado para o plano que está sendo editado (caso haja)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanResponse | null>(null);

  // Estados para os campos do formulário (usados para criação e edição)
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPrice, setPlanPrice] = useState(0);
  const [benefits, setBenefits] = useState<SubscriptionPlanBenefit[]>([]);
  const [benefitText, setBenefitText] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await listSubscriptionPlans(clubId);
      setPlans(data);
    } catch (error) {
      console.error("Erro ao listar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [clubId]);

  // Quando o usuário clica em um card para editar, preenche os campos do formulário.
  const startEditing = (plan: SubscriptionPlanResponse) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanDescription(plan.description);
    setPlanPrice(plan.price);
    setBenefits(plan.benefits || []);
    setBenefitText("");
    setView("edit");
  };

  async function handleCreatePlan(e: FormEvent) {
    e.preventDefault();
    try {
      const payload: SubscriptionPlanCreate = {
        club_id: clubId,
        name: planName,
        description: planDescription,
        price: planPrice,
        benefits,
      };

      await createSubscriptionPlan(payload);
      // Limpa o formulário
      setPlanName("");
      setPlanDescription("");
      setPlanPrice(0);
      setBenefits([]);
      setBenefitText("");
      alert("Plano criado com sucesso!");
      setView("list");
      fetchPlans();
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
  }

  async function handleUpdatePlan(e: FormEvent) {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const payload: SubscriptionPlanCreate = {
        club_id: clubId,
        name: planName,
        description: planDescription,
        price: planPrice,
        benefits,
      };

      await updateSubscriptionPlan(editingPlan.id.toString(), payload);
      // Limpa o formulário e sai do modo de edição
      setEditingPlan(null);
      setPlanName("");
      setPlanDescription("");
      setPlanPrice(0);
      setBenefits([]);
      setBenefitText("");
      alert("Plano atualizado com sucesso!");
      setView("list");
      fetchPlans();
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
    }
  }

  async function handleDeletePlan() {
    if (!editingPlan) return;
    if (!confirm("Tem certeza que deseja deletar este plano?")) return;
    try {
      await deleteSubscriptionPlan(editingPlan.id.toString());
      alert("Plano deletado com sucesso!");
      setEditingPlan(null);
      setPlanName("");
      setPlanDescription("");
      setPlanPrice(0);
      setBenefits([]);
      setBenefitText("");
      setView("list");
      fetchPlans();
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
    }
  }

  function handleAddBenefit() {
    if (!benefitText.trim()) return;
    if (benefits.length >= 10) {
      alert("Máximo de 10 benefícios permitidos.");
      return;
    }
    setBenefits([...benefits, { benefit: benefitText }]);
    setBenefitText("");
  }

  function handleRemoveBenefit(index: number) {
    setBenefits(benefits.filter((_, i) => i !== index));
  }

  // Componente do formulário (usado para criação e edição)
  const formView = (
    <div className={styles.createPlanContainer}>
      <h2 className={styles.title}>
        {view === "create" ? "Criar Novo Plano" : "Editar Plano"}
      </h2>
      <form
        onSubmit={view === "create" ? handleCreatePlan : handleUpdatePlan}
        className={styles.createPlanForm}
      >
        <div className={styles.contentFlex}>
          {/* Coluna Esquerda: Nome e Descrição */}
          <div className={styles.leftColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome do Plano</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className={styles.inputLarge}
                required
              />
              <p className={styles.inputHint}>
                Esse nome será exibido nos seus planos de assinatura.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição</label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                maxLength={500}
                className={`${styles.inputLarge} ${styles.textareaLarge}`}
                required
              />
              <div className={styles.counter}>
                {planDescription.length}/500
              </div>
              <p className={styles.inputHint}>
                Explique para o assinante o que ele encontrará nesse plano.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Preço e Benefícios */}
          <div className={styles.rightColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={planPrice}
                onChange={(e) => setPlanPrice(Number(e.target.value))}
                className={styles.inputLarge}
                required
              />
              <p className={styles.inputHint}>
                Defina o valor mensal do seu plano de assinatura.
              </p>
            </div>

            <div className={styles.benefitsSection}>
              <h2 className={styles.categoriesTitle}>Benefícios</h2>
              <p className={styles.categoriesSubtitle}>
                Você pode adicionar até 10 benefícios.
              </p>
              <div className={styles.benefitsInput}>
                <input
                  type="text"
                  placeholder="Ex: Acesso VIP, Conteúdo Exclusivo..."
                  value={benefitText}
                  onChange={(e) => setBenefitText(e.target.value)}
                  className={styles.inputLarge}
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className={styles.selectFileButton}
                >
                  Adicionar
                </button>
              </div>

              <div className={styles.categoriesList}>
                {benefits.map((b, idx) => (
                  <div key={idx} className={styles.categoryItem}>
                    {b.benefit}
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className={styles.removeButton}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              // Se estiver no modo de edição, limpar o estado de edição
              if (view === "edit") {
                setEditingPlan(null);
              }
              setPlanName("");
              setPlanDescription("");
              setPlanPrice(0);
              setBenefits([]);
              setBenefitText("");
              setView("list");
            }}
          >
            Cancelar
          </button>
          {view === "edit" && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeletePlan}
            >
              Deletar Plano
            </button>
          )}
          <button type="submit" className={styles.saveButton}>
            {view === "create" ? "Criar Plano" : "Atualizar Plano"}
          </button>
        </div>
      </form>
    </div>
  );

  // Visão de listagem dos planos
  const listView = (
    <div className={styles.managementContainer}>
      <h2 className={styles.title}>Planos de Assinatura</h2>
      <div className={styles.planList}>
        {loading ? (
          <p>Carregando...</p>
        ) : plans.length === 0 ? (
          <p>Nenhum plano encontrado.</p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={styles.planCard}
              onClick={() => startEditing(plan)}
            >
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planDescription}>{plan.description}</p>
              <p className={styles.planPrice}>
                Preço: R$ {plan.price.toFixed(2)}
              </p>
              {plan.benefits && plan.benefits.length > 0 && (
                <div className={styles.benefitsList}>
                  {plan.benefits.map((benefit) => (
                    <span key={benefit.id} className={styles.benefitItem}>
                      {benefit.benefit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div className={styles.createCard} onClick={() => setView("create")}>
          <p>+ Criar novo plano</p>
        </div>
      </div>
    </div>
  );

  return view === "list" ? listView : formView;
}
