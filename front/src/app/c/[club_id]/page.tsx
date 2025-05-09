"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getClub } from "@/services/club";
import { getClubStyle } from "@/services/clubStyle";
import { listSubscriptionPlans } from "@/services/subscriptionPlan";
import { ClubResponse } from "@/types/club";
import { ClubStyleResponse } from "@/types/clubStyle";
import { SubscriptionPlanResponse } from "@/types/subscriptionPlan";
import Button from "@/components/Button/Button";
import styles from "./PublicClubPage.module.css";
import BannerSlider from "@/components/BannerSlider/BannerSlider";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/** Monta URL da imagem (concatena com backend se não começar com http ou https) */
function getImageUrl(url: string) {
  if (url.startsWith("http")) return url;
  return backendUrl + url;
}

export default function PublicClubPage() {
  const { club_id } = useParams() as { club_id: string };
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [clubStyle, setClubStyle] = useState<ClubStyleResponse | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStyle, setLoadingStyle] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchClub() {
      try {
        const data = await getClub(club_id);
        if (isMounted) setClub(data);
      } catch (error) {
        console.error("Erro ao carregar o clube:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (club_id) {
      fetchClub();
    }
    return () => {
      isMounted = false;
    };
  }, [club_id]);

  useEffect(() => {
    let isMounted = true;

    async function fetchClubStyle() {
      try {
        const styleData = await getClubStyle(club_id);
        if (isMounted) setClubStyle(styleData);
      } catch (error) {
        console.error("Erro ao carregar o estilo do clube:", error);
      } finally {
        if (isMounted) setLoadingStyle(false);
      }
    }

    if (club_id) {
      fetchClubStyle();
    }
    return () => {
      isMounted = false;
    };
  }, [club_id]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSubscriptionPlans() {
      try {
        const plans = await listSubscriptionPlans(club_id);
        if (isMounted) setSubscriptionPlans(plans);
      } catch (error) {
        console.error("Erro ao carregar os planos:", error);
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    }

    if (club_id) {
      fetchSubscriptionPlans();
    }
    return () => {
      isMounted = false;
    };
  }, [club_id]);

  if (loading || loadingStyle) return <p>Carregando...</p>;
  if (!club) return <p>Clube não encontrado.</p>;

  const banners = clubStyle
    ? [
        clubStyle.banner1 || "/banner.svg",
        clubStyle.banner2 || "/banner.svg",
        clubStyle.banner3 || "/banner.svg",
      ]
    : ["/banner.svg"];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <div className={styles.circleLogo} style={{ background: clubStyle?.primary_color }}>
              <Image src="/c.svg" alt="Logo C" width={20} height={20} style={{ objectFit: "contain" }} />
            </div>
            {club.logo ? (
              <Image src={getImageUrl(club.logo)} alt={club.name} width={150} height={50} style={{ objectFit: "contain" }} />
            ) : (
              <span>Sem logo</span>
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/login" passHref>
            <Button text="Entrar" />
          </Link>
        </div>
      </header>

        {banners.length > 0 && <BannerSlider banners={banners} />}

      {/* Seção de Conteúdo */}
      <main className={styles.main}>
        <div className={styles.contentSection}>
          <div className={styles.leftContent}>
            <h1>{clubStyle?.title || club.name}</h1>
            <p>{clubStyle?.short_description}</p>
          </div>
          <div className={styles.rightContent}>
            {clubStyle?.video_link && (
              <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: clubStyle.video_link }} />
            )}
          </div>
        </div>
      </main>

      {/* Seção: Planos de Assinatura */}
      <section className={styles.plansSection}>
        <h2>Planos de Assinatura</h2>
        {loadingPlans ? (
          <p>Carregando planos...</p>
        ) : subscriptionPlans.length === 0 ? (
          <p>Nenhum plano disponível.</p>
        ) : (
          <div className={styles.plansGrid}>
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className={styles.planCard}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p>
                  <strong>Preço:</strong> R$ {plan.price.toFixed(2)}
                </p>
                {plan.benefits && plan.benefits.length > 0 && (
                  <div className={styles.benefitsContainer}>
                    {plan.benefits.map((benefit, index) => (
                      <div key={index} className={styles.benefitItem}>
                        <Image src="/check.svg" alt="Check" width={16} height={16} />
                        <span>{benefit.benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
