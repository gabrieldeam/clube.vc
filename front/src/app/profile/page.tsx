"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listUserSubscriptions, unsubscribeFromClub } from "../../services/clubSubscription";
import { ClubSubscriptionResponse } from "../../types/clubSubscription";

/**
 * Lista as inscrições do usuário, permitindo cancelar.
 */
export default function UserSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<ClubSubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const data = await listUserSubscriptions();
        setSubscriptions(data);
      } catch (error) {
        console.error("Erro ao listar inscrições:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      await unsubscribeFromClub(subscriptionId);
      // Atualiza a lista de inscrições
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Minhas Assinaturas</h1>
      {subscriptions.length === 0 ? (
        <p>Você não está inscrito em nenhum clube.</p>
      ) : (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.id}>
              <p>Clube ID: {sub.club_id}</p>
              <p>Plano ID: {sub.plan_id}</p>
              <button onClick={() => handleUnsubscribe(sub.id)}>
                Cancelar Inscrição
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => router.push("/clubs")}>Voltar para meus Clubes</button>
    </div>
  );
}
