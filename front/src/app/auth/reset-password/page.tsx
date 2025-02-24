"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../../../services/auth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error("Token inválido ou não fornecido.");
      }

      const response = await resetPassword(token, newPassword);
      setSuccessMessage(response.message); // Exibe a mensagem de sucesso
      setErrorMessage(null); // Limpa a mensagem de erro
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);

      // Verifica se o erro possui a estrutura de lista de detalhes
      if (Array.isArray(error.response?.data?.detail)) {
        const passwordError = error.response?.data?.detail.find(
          (err: any) => err.loc.includes("new_password")
        );
        if (passwordError) {
          setErrorMessage(passwordError.msg); // Exibe a mensagem específica de erro para senha
          return;
        }
      }

      // Caso seja outro tipo de erro
      setErrorMessage(error.response?.data?.detail || "Erro ao redefinir senha.");
      setSuccessMessage(null); // Limpa a mensagem de sucesso
    }
  };

  return (
    <div>
      <h1>Definir Nova Senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Digite sua nova senha"
          required
        />
        <button type="submit">Redefinir senha</button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
