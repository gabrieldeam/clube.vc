"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSubscriptionPlan } from "../../../../../services/subscriptionPlan";
import { SubscriptionPlanCreate, SubscriptionPlanBenefit } from "../../../../../types/subscriptionPlan";

/**
 * Tela para criar um novo plano de assinatura
 */
export default function CreatePlanPage() {
  const { clubId } = useParams() as { clubId: string };
  const router = useRouter();

  // Campos básicos do plano
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [benefits, setBenefits] = useState<SubscriptionPlanBenefit[]>([]);

  // Controle de estado para inserir benefits
  const [benefitText, setBenefitText] = useState("");

  // Função para adicionar um benefit à lista local
  const handleAddBenefit = () => {
    if (benefitText.trim()) {
      setBenefits((prev) => [...prev, { benefit: benefitText }]);
      setBenefitText("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planData: SubscriptionPlanCreate = {
        club_id: clubId,
        name,
        description,
        price,
        benefits,
      };
      await createSubscriptionPlan(planData);
      router.push(`/clubs/${clubId}/plans`);
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
  };

  return (
    <div>
      <h1>Criar Plano</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Plano:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
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
          {benefits.map((b, idx) => (
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
      <button onClick={() => router.back()}>Voltar</button>
    </div>
  );
}
