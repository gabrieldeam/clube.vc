"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { listSubscriptionPlans } from "../../../../services/subscriptionPlan";
import { SubscriptionPlanResponse } from "../../../../types/subscriptionPlan";
import Link from "next/link";

/**
 * Lista os planos de assinatura de um clube específico.
 * Somente o dono do clube deveria ter acesso, mas aqui
 * estamos apenas exemplificando a listagem.
 */
export default function ClubPlansPage() {
  const { clubId } = useParams() as { clubId: string };
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await listSubscriptionPlans(clubId);
        setPlans(data);
      } catch (error) {
        console.error("Erro ao listar planos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [clubId]);

  if (loading) return <p>Carregando planos...</p>;

  return (
    <div>
      <h1>Planos de Assinatura do Clube</h1>
      <Link href={`/clubs/${clubId}/plans/create`}>
        <button>Criar Novo Plano</button>
      </Link>

      {plans.length === 0 ? (
        <p>Nenhum plano encontrado.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              <strong>{plan.name}</strong> - R$ {plan.price.toFixed(2)}
              <p>{plan.description}</p>
              {plan.benefits?.length ? (
                <ul>
                  {plan.benefits.map((b, idx) => (
                    <li key={idx}>{b.benefit}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => router.back()}>Voltar</button>
    </div>
  );
}
