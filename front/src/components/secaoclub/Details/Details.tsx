"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CalendarComponent from "@/components/Calendar/Calendar";
import styles from "./Details.module.css";

interface DetailsSectionProps {
  clubId: string;
}

export default function DetailsSection({ clubId }: DetailsSectionProps) {
  // Estado para exibir ou ocultar faturamento
  const [showRevenue, setShowRevenue] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const filters = [
    { label: "1 dia", value: "1" },
    { label: "7 dias", value: "7" },
    { label: "15 dias", value: "15" },
    { label: "30 dias", value: "30" },
    { label: "45 dias", value: "45" },
    { label: "3 mês", value: "90" },
    { label: "6 mês", value: "180" },
    { label: "12 mês", value: "365" },
    { label: "18 mês", value: "540" },
    { label: "24 mês", value: "730" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDateDropdown = () => {
    setDateDropdownOpen((prev) => !prev);
  };

  const handleFilterClick = (filterValue: string) => {
    setSelectedFilter(filterValue);
    const days = parseInt(filterValue, 10);
    const today = new Date();
    const end = today;
    const start = new Date();
    start.setDate(today.getDate() - days);
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  const handleApplyFilters = () => {
    console.log("Filtros aplicados:", {
      selectedStartDate,
      selectedEndDate,
      selectedFilter,
    });
  };

  const handleCancel = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedFilter(null);
    setDateDropdownOpen(false);
  };

  // Conteúdo da seção de detalhes
  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  const clubLink = `${frontendUrl}/c/${clubId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(clubLink);
    alert("Link copiado!");
  };

  return (
    <div className={styles.detailsContainer}>
      <h2 className={styles.title}>Detalhes do Clube</h2>
      {/* Seção de faturamento */}
      <div className={styles.faturamentoSection}>
        <div className={styles.faturamentoHeader}>
          <div className={styles.leftHeader}>
            {/* Botão para visualizar/ocultar faturamento */}
            <button
              className={styles.eyeButton}
              onClick={() => setShowRevenue(!showRevenue)}
            >
              <Image
                src={showRevenue ? "/eye-open.svg" : "/eye-closed.svg"}
                alt="Visualizar faturamento"
                width={24}
                height={24}
              />
            </button>
            {/* Dropdown de datas e filtros */}
            <div className={styles.dateDropdownSection} ref={dateDropdownRef}>
              <button
                className={styles.dateDropdownToggle}
                onClick={toggleDateDropdown}
              >
                Selecionar datas e filtros
              </button>
              {dateDropdownOpen && (
                <div className={styles.filterSection}>
                  <div className={styles.filterTitle}>
                    <h1>Selecione um período</h1>
                    <p>Selecione o período que você quer ver os seus resultados</p>
                  </div>
                  <div className={styles.dateRangeDisplay}>
                    <div className={styles.startDate}>
                      {selectedStartDate
                        ? selectedStartDate.toLocaleDateString("pt-BR")
                        : "Data inicial"}
                    </div>
                    <div className={styles.separator}>até</div>
                    <div className={styles.endDate}>
                      {selectedEndDate
                        ? selectedEndDate.toLocaleDateString("pt-BR")
                        : "Data final"}
                    </div>
                  </div>
                  <div className={styles.calendarContainer}>
                    <CalendarComponent
                      selectedStartDate={selectedStartDate}
                      selectedEndDate={selectedEndDate}
                      onRangeChange={(start, end) => {
                        setSelectedStartDate(start);
                        setSelectedEndDate(end);
                      }}
                    />
                  </div>
                  <div className={styles.filtersContainer}>
                    <h2 className={styles.filtersTitle}>Últimos</h2>
                    <div className={styles.predefinedFilters}>
                      {filters.map((filter) => (
                        <button
                          key={filter.value}
                          className={`${styles.filterButton} ${
                            selectedFilter === filter.value ? styles.activeFilter : ""
                          }`}
                          onClick={() => handleFilterClick(filter.value)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.filterActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                    <button
                      className={styles.applyButton}
                      onClick={handleApplyFilters}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Cards de faturamento */}
        <div className={styles.revenueCards}>
          <div className={styles.card}>
            <h2>Receita Líquida</h2>
            <p className={styles.revenueValue}>
              {showRevenue ? "R$ 10.000,00" : "******"}
            </p>
          </div>
          <div className={styles.card}>
            <h2>Vendas Aprovadas e Completas</h2>
            <p className={styles.revenueValue}>
              {showRevenue ? "850" : "******"}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.lineBottom}></div>

      <label className={styles.label}>Link público</label>
      <div className={styles.linkContainer}>
        <input
          type="text"
          value={clubLink}
          readOnly
          className={styles.linkInput}
        />
        <button type="button" onClick={copyLink} className={styles.copyButton}>
          Copiar link
        </button>
      </div>
      <p className={styles.subtitle}>
        Este é o link público do seu clube. Compartilhe com seus clientes!
      </p>
    </div>
  );
}
