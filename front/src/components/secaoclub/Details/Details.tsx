"use client";

import React from "react";
import styles from "./Details.module.css";

export default function DetailsSection() {
  // Aqui, se quiser alguma lógica especial, você pode adicionar
  return (
    <div className={styles.detailsContainer}>
      <h2>Detalhes do Clube</h2>
      <p>Aqui estão as informações gerais do clube.</p>
    </div>
  );
}
