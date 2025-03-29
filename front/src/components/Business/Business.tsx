"use client";

import React, { useState, useEffect, useRef } from "react";
import TopMenu from "@/components/TopMenu/TopMenu";
import { useAuthContext } from "@/context/AuthContext";
import ClubCard from "@/components/ClubSection/ClubSection";
import CalendarComponent from '@/components/Calendar/Calendar'; 
import Image from "next/image";
import { listClubs } from "../../services/club";
import { ClubResponse } from "../../types/club";
import styles from "./business.module.css";

export default function Business() {
  const { user } = useAuthContext();
  const [showRevenue, setShowRevenue] = useState(false);
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Removemos os estados de data string e usamos somente os estados Date
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const clubDropdownRef = useRef<HTMLDivElement>(null);
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
    async function fetchClubs() {
      try {
        const data = await listClubs();
        setClubs(data);
      } catch (error) {
        console.error("Erro ao buscar clubes:", error);
      }
    }
    fetchClubs();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        clubDropdownRef.current &&
        !clubDropdownRef.current.contains(event.target as Node)
      ) {
        setClubDropdownOpen(false);
      }
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

  const toggleClubDropdown = () => {
    setClubDropdownOpen((prev) => !prev);
  };

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

  return (
    <div className={styles.negociosContainer}>
      <TopMenu />
      <div className={styles.content}>
        <h1>Oi {user?.name || "usuário"}, boas vindas 👋</h1>
        <p>Estes são os seus resultados gerados na Clube</p>
      </div>

      {/* Seção de faturamento */}
      <div className={styles.faturamentoSection}>
        <div className={styles.faturamentoHeader}>
          <div className={styles.leftHeader}>
            {/* Ícone de visualização */}
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
            {/* Dropdown de clubs */}
            <div className={styles.clubDropdown} ref={clubDropdownRef}>
              <button
                className={styles.clubDropdownButton}
                onClick={toggleClubDropdown}
              >
                {selectedClub
                  ? clubs.find((club) => club.id === selectedClub)?.name
                  : "Selecione um Club"}
              </button>
              {clubDropdownOpen && (
                <ul className={styles.clubDropdownList}>
                  {clubs.map((club) => (
                    <li
                      key={club.id}
                      onClick={() => {
                        setSelectedClub(club.id);
                        setClubDropdownOpen(false);
                      }}
                    >
                      {club.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dropdown de filtros de data */}
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

                  {/* Exibe o período selecionado */}
                <div className={styles.dateRangeDisplay}>
                    <div className={styles.startDate}>
                        {selectedStartDate ? selectedStartDate.toLocaleDateString('pt-BR') : "Data inicial"}
                    </div>
                    <div className={styles.separator}>até</div>
                    <div className={styles.endDate}>
                        {selectedEndDate ? selectedEndDate.toLocaleDateString('pt-BR') : "Data final"}
                    </div>
                </div>



                  {/* Calendário Grande */}
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

                  {/* Filtros Pré-definidos */}
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



                  {/* Ações: Cancelar e Aplicar */}
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
      <ClubCard/>
    </div>
  );
}
