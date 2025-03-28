"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, checkEmailExists } from "../../../services/auth";
import { useUserFlow } from "../../../context/UserFlowContext";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";

let typingTimer: NodeJS.Timeout;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const router = useRouter();
  const { flow } = useUserFlow();

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      validateEmail(value);
    }, 500);
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
      await loginUser({ email, password });
      setSuccessMessage("Login realizado com sucesso! Redirecionando...");
      setErrorMessage(null);
      setTimeout(() => {
        if (flow === "clubs") {
          router.push("/clubs");
        } else if (flow === "profile") {
          router.push("/profile");
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setErrorMessage(
        error.response?.data?.detail || "Erro ao realizar login."
      );
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

  const redirectToForgotPassword = () => {
    router.push(`/auth/forgot-password`);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
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
              <Button
                type="button"
                text="Registrar-se com esse email"
                onClick={redirectToRegister}
              />
            )}
          </div>
        )}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <Input
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
        <Button
          ref={submitButtonRef}
          text="Login"
          type="submit"
          disabled={!isEmailValid}
          style={{
            opacity: isEmailValid ? 1 : 0,
            pointerEvents: isEmailValid ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        />
      </form>
      <button type="button" onClick={redirectToForgotPassword}>
        Redefinir senha
      </button>
    </div>
  );
}
