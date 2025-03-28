"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { listSubscriptionPlans } from "../../../../services/subscriptionPlan";
import { subscribeToClub } from "../../../../services/clubSubscription";
import { SubscriptionPlanResponse } from "../../../../types/subscriptionPlan";
import { ClubSubscriptionCreate } from "../../../../types/clubSubscription";

/**
 * Tela para que qualquer usuário veja os planos e se inscreva.
 */
export default function SubscribePage() {
  const { clubId } = useParams() as { clubId: string };
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await listSubscriptionPlans(clubId);
        setPlans(data);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [clubId]);

  const handleSubscribe = async (planId: string) => {
    try {
      const payload: ClubSubscriptionCreate = {
        club_id: clubId,
        plan_id: planId,
      };
      await subscribeToClub(payload);
      setMessage("Assinatura realizada com sucesso!");
      // Aqui você pode redirecionar ou mostrar algum status
      // Ex: router.push("/profile/subscriptions");
    } catch (error) {
      console.error("Erro ao assinar:", error);
      setMessage("Erro ao assinar o plano.");
    }
  };

  if (loading) return <p>Carregando planos...</p>;

  return (
    <div>
      <h1>Assinar Clube</h1>
      {message && <p>{message}</p>}

      {plans.length === 0 ? (
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

      <button onClick={() => router.back()}>Voltar</button>
    </div>
  );
}
