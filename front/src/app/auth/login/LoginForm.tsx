"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, checkEmailExists } from "../../../services/auth";

let typingTimer: NodeJS.Timeout; // Timer para debounce

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Mensagem de sucesso
  const [isEmailValid, setIsEmailValid] = useState(false); // Controla a visibilidade do campo de senha
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focar automaticamente no campo de email ao carregar a página
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Verificar email com debounce
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    clearTimeout(typingTimer); // Reseta o timer
    typingTimer = setTimeout(() => {
      validateEmail(value); // Inicia validação após o debounce
    }, 500); // Tempo do debounce (500ms)
  };

  const validateEmail = async (value: string) => {
    if (!value.includes("@")) {
      setErrorMessage("Por favor, insira um email válido.");
      setSuccessMessage(null);
      setIsEmailValid(false);
      return;
    }

    try {
      const response = await checkEmailExists(value);
      if (!response.exists) {
        setErrorMessage("Esse email não está cadastrado.");
        setSuccessMessage(null);
        setIsEmailValid(false);
      } else {
        setErrorMessage(null);
        setIsEmailValid(true);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      setErrorMessage("Erro ao verificar email. Tente novamente.");
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      setSuccessMessage("Login realizado com sucesso! Redirecionando...");
      setErrorMessage(null);
      setTimeout(() => {
        router.push("/"); // Redireciona após 2 segundos
      }, 2000);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setErrorMessage(error.response?.data?.detail || "Erro ao realizar login.");
      setSuccessMessage(null);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isEmailValid && passwordInputRef.current) {
      e.preventDefault();
      passwordInputRef.current.focus();
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && submitButtonRef.current) {
      e.preventDefault();
      submitButtonRef.current.click();
    }
  };

  const redirectToRegister = () => {
    router.push(`/auth/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          ref={emailInputRef}
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown}
          placeholder="Email"
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
        {successMessage && (
          <p style={{ color: "green" }}>{successMessage}</p>
        )}
        <input
          ref={passwordInputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeyDown}
          placeholder="Senha"
          required
          disabled={!isEmailValid}
          style={{
            opacity: isEmailValid ? 1 : 0,
            pointerEvents: isEmailValid ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        />
        <button
          ref={submitButtonRef}
          type="submit"
          disabled={!isEmailValid}
          style={{
            opacity: isEmailValid ? 1 : 0,
            pointerEvents: isEmailValid ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
