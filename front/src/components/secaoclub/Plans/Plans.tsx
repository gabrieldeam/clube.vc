"use client";

import React, { useState, useEffect } from "react";
import { listSubscriptionPlans } from "@/services/subscriptionPlan"; // Exemplo
import styles from "./Plans.module.css";

interface PlansProps {
  // Se você precisar do ID do clube, pode receber via prop
  // clubId: string;
}

export default function PlansSection(/* { clubId }: PlansProps */) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Exemplo de fetch de planos
  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        // const data = await listSubscriptionPlans(clubId);
        // setPlans(data);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  if (loading) {
    return <p>Carregando planos...</p>;
  }

  return (
    <div className={styles.plansContainer}>
      <h2>Planos de Assinatura</h2>
      {plans.length === 0 ? (
        <p>Nenhum plano encontrado.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>{plan.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
