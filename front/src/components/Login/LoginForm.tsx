"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, checkEmailExists } from "@/services/auth";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import styles from "./loginForm.module.css";

// Variável para armazenar o timer enquanto o usuário digita
let typingTimer: NodeJS.Timeout;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Foca automaticamente no input de email ao carregar o componente
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Gerencia a alteração do email e inicia a validação após 500ms de inatividade
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      validateEmail(value);
    }, 500);
  };

  // Valida o formato do email e, se estiver correto, verifica se ele existe no sistema
  const validateEmail = async (value: string) => {
    // Verifica se o email contém "@" e se há um "." após o "@"
    const atIndex = value.indexOf("@");
    if (atIndex === -1 || value.indexOf(".", atIndex) === -1) {
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

  // Gerencia o envio do formulário para realizar o login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      setSuccessMessage("Login realizado com sucesso! Redirecionando...");
      setErrorMessage(null);
  
      // Aguarda 3 segundos para garantir que o token seja armazenado no cookie
      setTimeout(() => {
        // Força um reload completo da página
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setErrorMessage(
        error.response?.data?.detail || "Erro ao realizar login."
      );
      setSuccessMessage(null);
    }
  };

  // Ao pressionar "Enter" no campo de email, foca no campo de senha
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && passwordInputRef.current) {
      e.preventDefault();
      passwordInputRef.current.focus();
    }
  };

  // Ao pressionar "Enter" no campo de senha, dispara o clique do botão de envio
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && submitButtonRef.current) {
      e.preventDefault();
      submitButtonRef.current.click();
    }
  };

  // Redireciona para a página de registro, passando o email como query string
  const redirectToRegister = () => {
    router.push(`/auth/register?email=${encodeURIComponent(email)}`);
  };

  // Redireciona para a página de recuperação de senha
  const redirectToForgotPassword = () => {
    router.push(`/auth/forgot-password`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.container}>
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
          
          <div className={styles.password}>
            <Input
              ref={passwordInputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
              placeholder="Senha"
              required
            />
            <button
              className={styles.button}
              type="button"
              onClick={redirectToForgotPassword}
            >
              ESQUECEU A SENHA?
            </button>
          </div>
          
          <p>
            Ao fazer login e usar o Clube, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
          <button
            className={styles.button}
            type="button"
            onClick={redirectToRegister}
          >
            INSCREVA-SE NA CLUBE
          </button>

          <div className={styles.login}>
            <Button ref={submitButtonRef} text="ENTRAR" type="submit" />
          </div>
        </div>
      </form>      
    </div>
  );
}
