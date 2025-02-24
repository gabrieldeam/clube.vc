"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkEmailExists, forgotPassword } from "../../../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (!inputValue.includes("@")) {
      setErrorMessage("Por favor, insira um email válido.");
      setEmailExists(false);
      return;
    }

    try {
      const response = await checkEmailExists(inputValue);
      if (response.exists) {
        setErrorMessage(null);
        setEmailExists(true);
      } else {
        setErrorMessage("Esse email não está cadastrado.");
        setEmailExists(false);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      setErrorMessage("Erro ao verificar email.");
      setEmailExists(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setSuccessMessage(response.message);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setErrorMessage(error.response?.data?.detail || "Erro ao solicitar redefinição.");
      setSuccessMessage(null);
    }
  };

  const redirectToRegister = () => {
    router.push(`/auth/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <h1>Redefinir Senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Digite seu email"
          required
        />
        {errorMessage && (
          <div>
            <p style={{ color: "red" }}>{errorMessage}</p>
            {errorMessage === "Esse email não está cadastrado." && (
              <button type="button" onClick={redirectToRegister}>
                Registrar-se com esse email
              </button>
            )}
          </div>
        )}
        <button type="submit" disabled={!emailExists}>
          Enviar email
        </button>
      </form>
      <div>
        {errorMessage !== "Esse email não está cadastrado." && (
          <>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
}
