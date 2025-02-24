"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "../../../services/auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Armazena a mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Armazena a mensagem de sucesso

  const handleVerification = async () => {
    try {
      const response = await verifyEmail(token || "");
      setSuccessMessage(response.message); // Mostra a mensagem de sucesso
      setErrorMessage(null); // Limpa a mensagem de erro, caso exista
    } catch (error: any) {
      console.error("Erro ao verificar email:", error);
      setErrorMessage(error.response?.data?.detail || "Erro desconhecido."); // Mostra a mensagem de erro detalhada
    }
  };

  return (
    <div>
      <h1>Verificar Email</h1>
      <button onClick={handleVerification}>Verificar</button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
