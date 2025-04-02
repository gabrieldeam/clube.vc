"use client";

import React, {
  useState,
  useEffect,
  FormEvent,
  DragEvent,
  useRef,
} from "react";
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

// URL do backend para exibir as imagens (caso não esteja definida, utiliza localhost)
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface EstiloSectionProps {
  clubId: string;
}

export default function EstiloSection({ clubId }: EstiloSectionProps) {
  // Modo do formulário: "create" ou "edit"
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(true);

  // Estado do estilo vindo do back (se existir)
  const [clubStyle, setClubStyle] = useState<ClubStyleResponse | null>(null);

  // Estados dos campos gerais (lado esquerdo)
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  // Estados para o FAQ (informações)
  const [infos, setInfos] = useState<ClubStyleInfo[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  // Estados dos campos (lado direito)
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [primaryTextColor, setPrimaryTextColor] = useState("");
  const [secondaryTextColor, setSecondaryTextColor] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");

  // Estados dos arquivos (banners e imagem de promoção)
  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);
  const [banner3, setBanner3] = useState<File | null>(null);
  const [promoImage, setPromoImage] = useState<File | null>(null);

  // Refs para inputs de arquivos (drop zones)
  const banner1InputRef = useRef<HTMLInputElement>(null);
  const banner2InputRef = useRef<HTMLInputElement>(null);
  const banner3InputRef = useRef<HTMLInputElement>(null);
  const promoImageInputRef = useRef<HTMLInputElement>(null);

  // Busca o estilo do clube e decide o modo do formulário
  const fetchClubStyle = async () => {
    try {
      setLoading(true);
      const data = await getClubStyle(clubId);
      if (data) {
        setClubStyle(data);
        // Preenche os campos com os dados vindos do back
        setTitle(data.title);
        setShortDescription(data.short_description || "");
        setFullDescription(data.full_description || "");
        setPrimaryColor(data.primary_color || "");
        setSecondaryColor(data.secondary_color || "");
        setPrimaryTextColor(data.primary_text_color || "");
        setSecondaryTextColor(data.secondary_text_color || "");
        setVideoLink(data.video_link || "");
        setPromoTitle(data.promo_title || "");
        setPromoSubtitle(data.promo_subtitle || "");
        setInfos(data.infos || []);
        setMode("edit");
      } else {
        setMode("create");
      }
    } catch (error) {
      console.error("Erro ao obter o estilo do clube:", error);
      setMode("create");
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
    setFaqQuestion("");
    setFaqAnswer("");
    setBanner1(null);
    setBanner2(null);
    setBanner3(null);
    setPromoImage(null);
  };

  // Remove uma FAQ da lista
  const handleRemoveInfo = (index: number) => {
    setInfos(infos.filter((_, idx) => idx !== index));
  };

  // Adiciona uma FAQ à lista (máximo 20)
  const handleAddFAQ = () => {
    if (infos.length >= 20) {
      alert("Você só pode adicionar até 20 FAQs.");
      return;
    }
    if (faqQuestion.trim() === "" || faqAnswer.trim() === "") return;
    setInfos([...infos, { info_title: faqQuestion, info_content: faqAnswer }]);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  // Handlers de submissão
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
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
        fetchClubStyle();
      } catch (error) {
        console.error("Erro ao criar estilo:", error);
      }
    } else {
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
        fetchClubStyle();
      } catch (error) {
        console.error("Erro ao atualizar estilo:", error);
      }
    }
  };

  // Handler para exclusão
  const handleDeleteStyle = async () => {
    if (!clubStyle) return;
    if (!confirm("Tem certeza que deseja deletar este estilo?")) return;
    try {
      await deleteClubStyle(clubStyle.id);
      alert("Estilo deletado com sucesso!");
      resetForm();
      setMode("create");
      setClubStyle(null);
    } catch (error) {
      console.error("Erro ao deletar estilo:", error);
    }
  };

  // Handlers para drop zones das imagens
  const handleBannerDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropBanner = (
    e: DragEvent<HTMLDivElement>,
    setFile: (file: File) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        {mode === "create" ? "Criar Estilo" : "Editar Estilo"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.styleForm}>
        <div className={styles.columnsContainer}>
          {/* Coluna Esquerda: Informações Gerais e FAQ */}
          <div className={styles.leftColumn}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className={styles.inputLarge}
                required
              />
              <span className={styles.counter}>{title.length} / 200</span>
              <p className={styles.inputHint}>
                Insira o título que representa o estilo do clube.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição Curta</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                maxLength={1000}
                className={`${styles.inputLarge} ${styles.textareaMedium}`}
              />
              <span className={styles.counter}>
                {shortDescription.length} / 1000
              </span>
              <p className={styles.inputHint}>
                Forneça uma breve descrição que resuma o estilo.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição Completa</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                maxLength={200}
                className={`${styles.inputLarge} ${styles.textareaLarge}`}
              />
              <span className={styles.counter}>
                {fullDescription.length} / 200
              </span>
              <p className={styles.inputHint}>
                Descreva detalhadamente as características do estilo.
              </p>
            </div>
            {/* Seção FAQ */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>FAQ</label>
              <div className={styles.faqInputRow}>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Pergunta"
                  className={styles.inputMedium}
                />
                <input
                  type="text"
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Resposta"
                  className={styles.inputMedium}
                />
                <button
                  type="button"
                  className={styles.addFaqButton}
                  onClick={handleAddFAQ}
                >
                  Adicionar FAQ
                </button>
              </div>
              <p className={styles.inputHint}>
                Insira FAQs para o clube (máximo 20).
              </p>
              <div className={styles.faqList}>
                {infos.map((faq, idx) => (
                  <div key={idx} className={styles.faqItem}>
                    <div className={styles.faqQuestion}>
                      <strong>Pergunta:</strong> {faq.info_title}
                    </div>
                    <div className={styles.faqAnswer}>
                      <strong>Resposta:</strong> {faq.info_content}
                    </div>
                    <button
                      type="button"
                      className={styles.removeFaqButton}
                      onClick={() => handleRemoveInfo(idx)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Coluna Direita: Cores, Vídeo, Promoção e Imagens */}
          <div className={styles.rightColumn}>
            <div className={styles.row}>

              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Cor Primária</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    className={styles.inputColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className={styles.inputLarge}
                    placeholder="#000000"
                  />
                </div>
                <p className={styles.inputHint}>Defina a cor primária (ex: #000000).</p>
              </div>

              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Cor Secundária</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    className={styles.inputColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className={styles.inputLarge}
                    placeholder="#ffffff"
                  />
                </div>
                <p className={styles.inputHint}>Defina a cor secundária (ex: #ffffff).</p>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Texto Primário</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={primaryTextColor}
                    className={styles.inputColor}
                    onChange={(e) => setPrimaryTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={primaryTextColor}
                    onChange={(e) => setPrimaryTextColor(e.target.value)}
                    className={styles.inputLarge}
                    placeholder="#000000"
                  />
                </div>
                <p className={styles.inputHint}>Cor do texto principal.</p>
              </div>

              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Texto Secundário</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={secondaryTextColor}
                    className={styles.inputColor}
                    onChange={(e) => setSecondaryTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={secondaryTextColor}
                    onChange={(e) => setSecondaryTextColor(e.target.value)}
                    className={styles.inputLarge}
                    placeholder="#ffffff"
                  />
                </div>
                <p className={styles.inputHint}>Cor do texto secundário.</p>
              </div>


            </div>
            <div className={styles.fullRow}>
              <label className={styles.label}>Link de Vídeo</label>
              <textarea
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className={styles.inputLarge}
                placeholder="https://"
              />
              <p className={styles.inputHint}>
                Insira o link do vídeo (opcional).
              </p>
            </div>

            <div className={styles.row}>
              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Título da Promoção</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className={styles.inputLarge}
                />
                <p className={styles.inputHint}>
                  Informe o título da promoção.
                </p>
              </div>
              <div className={styles.halfInputGroup}>
                <label className={styles.label}>Subtítulo da Promoção</label>
                <input
                  type="text"
                  value={promoSubtitle}
                  onChange={(e) => setPromoSubtitle(e.target.value)}
                  maxLength={500}
                  className={styles.inputLarge}
                />
                <p className={styles.inputHint}>
                  Informe o subtítulo da promoção.
                  {promoSubtitle.length} / 500
                </p>
              </div>
            </div>
            {/* Bloco de imagens */}
            <div className={styles.inputBlock}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 1</label>
              <div
                className={styles.imageUploadContainer}
                onDragOver={handleBannerDragOver}
                onDrop={(e) => handleDropBanner(e, setBanner1)}
              >
                <div className={styles.imagePreviewWrapper}>
                  {banner1 ? (
                    <img
                      src={URL.createObjectURL(banner1)}
                      alt="Banner 1"
                      className={styles.imagePreview}
                    />
                  ) : clubStyle?.banner1 ? (
                    <img
                      src={backendUrl + clubStyle.banner1}
                      alt="Banner 1"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>Sem imagem</div>
                  )}
                </div>
                <div
                  className={styles.imageUploadWrapper}
                  onClick={() => banner1InputRef.current?.click()}
                >
                  <span className={styles.uploadButtonText}>
                    Arraste ou selecione um arquivo
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={banner1InputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) setBanner1(e.target.files[0]);
                }}
              />
              <p className={styles.inputHint}>
                Imagem JPG ou PNG, até 5 MB. Dimensões ideais: 1200x400 px.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 2</label>
              <div
                className={styles.imageUploadContainer}
                onDragOver={handleBannerDragOver}
                onDrop={(e) => handleDropBanner(e, setBanner2)}
              >
                <div className={styles.imagePreviewWrapper}>
                  {banner2 ? (
                    <img
                      src={URL.createObjectURL(banner2)}
                      alt="Banner 2"
                      className={styles.imagePreview}
                    />
                  ) : clubStyle?.banner2 ? (
                    <img
                      src={backendUrl + clubStyle.banner2}
                      alt="Banner 2"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>Sem imagem</div>
                  )}
                </div>
                <div
                  className={styles.imageUploadWrapper}
                  onClick={() => banner2InputRef.current?.click()}
                >
                  <span className={styles.uploadButtonText}>
                    Arraste ou selecione um arquivo
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={banner2InputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) setBanner2(e.target.files[0]);
                }}
              />
              <p className={styles.inputHint}>
                Imagem JPG ou PNG, até 5 MB. Dimensões ideais: 1200x400 px.
              </p>
            </div>
            </div>
            <div className={styles.inputBlock}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Banner 3</label>
              <div
                className={styles.imageUploadContainer}
                onDragOver={handleBannerDragOver}
                onDrop={(e) => handleDropBanner(e, setBanner3)}
              >
                <div className={styles.imagePreviewWrapper}>
                  {banner3 ? (
                    <img
                      src={URL.createObjectURL(banner3)}
                      alt="Banner 3"
                      className={styles.imagePreview}
                    />
                  ) : clubStyle?.banner3 ? (
                    <img
                      src={backendUrl + clubStyle.banner3}
                      alt="Banner 3"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>Sem imagem</div>
                  )}
                </div>
                <div
                  className={styles.imageUploadWrapper}
                  onClick={() => banner3InputRef.current?.click()}
                >
                  <span className={styles.uploadButtonText}>
                    Arraste ou selecione um arquivo
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={banner3InputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) setBanner3(e.target.files[0]);
                }}
              />
              <p className={styles.inputHint}>
                Imagem JPG ou PNG, até 5 MB. Dimensões ideais: 1200x400 px.
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Imagem de Promoção</label>
              <div
                className={styles.imageUploadContainer}
                onDragOver={handleBannerDragOver}
                onDrop={(e) => handleDropBanner(e, setPromoImage)}
              >
                <div className={styles.imagePreviewWrapper}>
                  {promoImage ? (
                    <img
                      src={URL.createObjectURL(promoImage)}
                      alt="Promoção"
                      className={styles.imagePreview}
                    />
                  ) : clubStyle?.promo_image ? (
                    <img
                      src={backendUrl + clubStyle.promo_image}
                      alt="Promoção"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>Sem imagem</div>
                  )}
                </div>
                <div
                  className={styles.imageUploadWrapper}
                  onClick={() => promoImageInputRef.current?.click()}
                >
                  <span className={styles.uploadButtonText}>
                    Arraste ou selecione um arquivo
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={promoImageInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) setPromoImage(e.target.files[0]);
                }}
              />
              <p className={styles.inputHint}>
                Imagem JPG ou PNG, até 5 MB. Dimensões ideais: 1200x400 px.
              </p>
            </div>
          </div>
        </div>            
        </div>
        <div className={styles.formButtons}>
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
}
