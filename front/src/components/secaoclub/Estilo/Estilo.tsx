"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  createClubStyle,
  getClubStyle,
  updateClubStyle,
  deleteClubStyle,
} from "@/services/clubStyle";
import {
  ClubStyleCreate,
  ClubStyleResponse,
  ClubStyleUpdate,
  ClubStyleInfo,
} from "@/types/clubStyle";
import styles from "./Estilo.module.css";

interface EstiloSectionProps {
  clubId: string;
}

export default function EstiloSection({ clubId }: EstiloSectionProps) {
  // Controle da visualização: "list" para exibição, "form" para criar/editar
  const [view, setView] = useState<"list" | "form">("list");
  // Modo do formulário: "create" ou "edit"
  const [mode, setMode] = useState<"create" | "edit">("create");

  // Estado para o estilo atual do clube (se existir)
  const [clubStyle, setClubStyle] = useState<ClubStyleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para os campos do formulário
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [primaryTextColor, setPrimaryTextColor] = useState("");
  const [secondaryTextColor, setSecondaryTextColor] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");
  const [infos, setInfos] = useState<ClubStyleInfo[]>([]);
  const [infoText, setInfoText] = useState("");

  // Estados para os arquivos (banners e promo image)
  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);
  const [banner3, setBanner3] = useState<File | null>(null);
  const [promoImage, setPromoImage] = useState<File | null>(null);

  // Busca o estilo do clube
  const fetchClubStyle = async () => {
    try {
      setLoading(true);
      const data = await getClubStyle(clubId);
      setClubStyle(data);
    } catch (error) {
      console.error("Erro ao obter o estilo do clube:", error);
      setClubStyle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubStyle();
  }, [clubId]);

  // Reseta os campos do formulário
  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setFullDescription("");
    setPrimaryColor("");
    setSecondaryColor("");
    setPrimaryTextColor("");
    setSecondaryTextColor("");
    setVideoLink("");
    setPromoTitle("");
    setPromoSubtitle("");
    setInfos([]);
    setInfoText("");
    setBanner1(null);
    setBanner2(null);
    setBanner3(null);
    setPromoImage(null);
  };

  // Muda para modo de criação
  const startCreate = () => {
    resetForm();
    setMode("create");
    setView("form");
  };

  // Muda para modo de edição, pré-preenchendo os campos com os dados atuais
  const startEdit = () => {
    if (clubStyle) {
      setTitle(clubStyle.title);
      setShortDescription(clubStyle.short_description || "");
      setFullDescription(clubStyle.full_description || "");
      setPrimaryColor(clubStyle.primary_color || "");
      setSecondaryColor(clubStyle.secondary_color || "");
      setPrimaryTextColor(clubStyle.primary_text_color || "");
      setSecondaryTextColor(clubStyle.secondary_text_color || "");
      setVideoLink(clubStyle.video_link || "");
      setPromoTitle(clubStyle.promo_title || "");
      setPromoSubtitle(clubStyle.promo_subtitle || "");
      setInfos(clubStyle.infos || []);
      // Arquivos não são pré-preenchidos
      setBanner1(null);
      setBanner2(null);
      setBanner3(null);
      setPromoImage(null);
    }
    setMode("edit");
    setView("form");
  };

  // Adiciona uma informação à lista de infos (aqui tratamos cada info como um item com título)
  const handleAddInfo = () => {
    if (infoText.trim() === "") return;
    setInfos([...infos, { info_title: infoText }]);
    setInfoText("");
  };

  // Submissão do formulário para criação
  const handleCreateStyle = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload: ClubStyleCreate = {
        club_id: clubId,
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        primary_text_color: primaryTextColor,
        secondary_text_color: secondaryTextColor,
        video_link: videoLink,
        promo_title: promoTitle,
        promo_subtitle: promoSubtitle,
        infos,
      };
      await createClubStyle(
        payload,
        banner1 || undefined,
        banner2 || undefined,
        banner3 || undefined,
        promoImage || undefined
      );
      alert("Estilo criado com sucesso!");
      setView("list");
      fetchClubStyle();
    } catch (error) {
      console.error("Erro ao criar estilo:", error);
    }
  };

  // Submissão do formulário para atualização
  const handleUpdateStyle = async (e: FormEvent) => {
    e.preventDefault();
    if (!clubStyle) return;
    try {
      const payload: ClubStyleUpdate = {
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        primary_text_color: primaryTextColor,
        secondary_text_color: secondaryTextColor,
        video_link: videoLink,
        promo_title: promoTitle,
        promo_subtitle: promoSubtitle,
        infos,
      };
      await updateClubStyle(
        clubStyle.id,
        payload,
        banner1 || undefined,
        banner2 || undefined,
        banner3 || undefined,
        promoImage || undefined
      );
      alert("Estilo atualizado com sucesso!");
      setView("list");
      fetchClubStyle();
    } catch (error) {
      console.error("Erro ao atualizar estilo:", error);
    }
  };

  // Deleta o estilo
  const handleDeleteStyle = async () => {
    if (!clubStyle) return;
    if (!confirm("Tem certeza que deseja deletar este estilo?")) return;
    try {
      await deleteClubStyle(clubStyle.id);
      alert("Estilo deletado com sucesso!");
      setClubStyle(null);
      setView("list");
    } catch (error) {
      console.error("Erro ao deletar estilo:", error);
    }
  };

  // Formulário (usado para criação e edição)
  const formView = (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        {mode === "create" ? "Criar Estilo" : "Editar Estilo"}
      </h2>
      <form
        onSubmit={mode === "create" ? handleCreateStyle : handleUpdateStyle}
        className={styles.styleForm}
      >
        <div className={styles.contentFlex}>
          {/* Coluna Esquerda: Título, Descrições, Infos */}
          <div className={styles.leftColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputLarge}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição Curta</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={`${styles.inputLarge} ${styles.textareaMedium}`}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição Completa</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className={`${styles.inputLarge} ${styles.textareaLarge}`}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Informações (separadas por vírgula)
              </label>
              <input
                type="text"
                value={infoText}
                onChange={(e) => setInfoText(e.target.value)}
                className={styles.inputLarge}
              />
              <button
                type="button"
                className={styles.addInfoButton}
                onClick={handleAddInfo}
              >
                Adicionar Informação
              </button>
              <div className={styles.infoList}>
                {infos.map((info, idx) => (
                  <div key={idx} className={styles.infoItem}>
                    {info.info_title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Cores, Vídeo, Promoção e Uploads */}
          <div className={styles.rightColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cor Primária</label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className={styles.inputLarge}
                placeholder="#000000"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cor Secundária</label>
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className={styles.inputLarge}
                placeholder="#ffffff"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Texto Primário</label>
              <input
                type="text"
                value={primaryTextColor}
                onChange={(e) => setPrimaryTextColor(e.target.value)}
                className={styles.inputLarge}
                placeholder="#000000"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Texto Secundário</label>
              <input
                type="text"
                value={secondaryTextColor}
                onChange={(e) => setSecondaryTextColor(e.target.value)}
                className={styles.inputLarge}
                placeholder="#ffffff"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Link de Vídeo</label>
              <input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className={styles.inputLarge}
                placeholder="https://"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Título da Promoção</label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className={styles.inputLarge}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Subtítulo da Promoção</label>
              <input
                type="text"
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                className={styles.inputLarge}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 1</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setBanner1(e.target.files[0])
                }
                className={styles.inputFile}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 2</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setBanner2(e.target.files[0])
                }
                className={styles.inputFile}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 3</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setBanner3(e.target.files[0])
                }
                className={styles.inputFile}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Imagem de Promoção</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setPromoImage(e.target.files[0])
                }
                className={styles.inputFile}
              />
            </div>
          </div>
        </div>

        <div className={styles.formButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setView("list")}
          >
            Cancelar
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeleteStyle}
            >
              Deletar Estilo
            </button>
          )}
          <button type="submit" className={styles.saveButton}>
            {mode === "create" ? "Criar Estilo" : "Atualizar Estilo"}
          </button>
        </div>
      </form>
    </div>
  );

  // Visão de listagem: se houver estilo, exibe os dados; se não, exibe um card para criar.
  const listView = (
    <div className={styles.managementContainer}>
      <h2 className={styles.title}>Estilo do Clube</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : clubStyle ? (
        <div className={styles.styleCard}>
          <h3 className={styles.styleTitle}>{clubStyle.title}</h3>
          {clubStyle.short_description && (
            <p className={styles.styleShortDescription}>
              {clubStyle.short_description}
            </p>
          )}
          {clubStyle.full_description && (
            <p className={styles.styleFullDescription}>
              {clubStyle.full_description}
            </p>
          )}
          <div className={styles.styleDetails}>
            <p>
              <strong>Cor Primária:</strong> {clubStyle.primary_color}
            </p>
            <p>
              <strong>Cor Secundária:</strong> {clubStyle.secondary_color}
            </p>
            <p>
              <strong>Texto Primário:</strong> {clubStyle.primary_text_color}
            </p>
            <p>
              <strong>Texto Secundário:</strong> {clubStyle.secondary_text_color}
            </p>
            {clubStyle.video_link && (
              <p>
                <strong>Vídeo:</strong> {clubStyle.video_link}
              </p>
            )}
            {clubStyle.promo_title && (
              <p>
                <strong>Promoção:</strong> {clubStyle.promo_title} -{" "}
                {clubStyle.promo_subtitle}
              </p>
            )}
          </div>
          {clubStyle.banner1 && (
            <div className={styles.styleImageContainer}>
              <img
                src={clubStyle.banner1}
                alt="Banner 1"
                className={styles.styleImage}
              />
            </div>
          )}
          {clubStyle.promo_image && (
            <div className={styles.styleImageContainer}>
              <img
                src={clubStyle.promo_image}
                alt="Promoção"
                className={styles.styleImage}
              />
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.editButton}
              onClick={startEdit}
            >
              Editar Estilo
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.createCard} onClick={startCreate}>
          <p>+ Criar Estilo</p>
        </div>
      )}
    </div>
  );

  return view === "list" ? listView : formView;
}
