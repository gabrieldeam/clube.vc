"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser, checkEmailExists } from "../../../services/auth";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import styles from "./registerPage.module.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    accepted_privacy_policy: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleEmailBlur = async () => {
    try {
      const response = await checkEmailExists(formData.email);
      if (response.exists) {
        setErrorMessage("Esse email já existe.");
        setSuccessMessage(null);
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      setErrorMessage("Erro ao verificar email.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, accepted_privacy_policy: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error);
      if (Array.isArray(error.response?.data?.detail)) {
        const passwordError = error.response?.data?.detail.find(
          (err: any) => err.loc.includes("password")
        );
        if (passwordError) {
          setErrorMessage(passwordError.msg);
          return;
        }
      }
      setErrorMessage(
        error.response?.data?.detail || "Erro ao registrar usuário."
      );
      setSuccessMessage(null);
    }
  };

  const redirectToLogin = () => {
    router.push(`/`);
  };

  const redirectToResetPassword = () => {
    router.push("/auth/reset-password");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <section className={styles.container}>
      {/* Lado Esquerdo: Formulário de Registro */}
      <div className={styles.left}>
        <div className={styles.leftContainer}>
          <img src="/clubeLogo.svg" alt="Clube Logo" className={styles.logo} />
          <div className={styles.registerContainer}>
            <h2 className={styles.headerText}>Crie sua Conta</h2>
            <p className={styles.subText}>
              Preencha os dados abaixo para se cadastrar na nossa plataforma.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                type="text"
                name="name"
                placeholder="Nome"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                required
              />
              <Input
                type="phone"
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="accepted_privacy_policy"
                  checked={formData.accepted_privacy_policy}
                  onChange={handleCheckboxChange}
                  required
                  className={styles.checkbox}
                />
                <label> Aceito a política de privacidade</label>
              </div>
              <Button
                type="submit"
                text="Registrar"
              />
              {errorMessage && (
                <div className={styles.errorMessage}>
                  <p>{errorMessage}</p>
                  {errorMessage === "Esse email já existe." && (
                    <Button
                      type="button"
                      onClick={redirectToLogin}
                      text="Fazer login com esse email"
                      className={styles.linkButton}
                    />
                  )}
                </div>
              )}
              {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
              )}
            </form>
            <div className={styles.bottomLinks}>
              <span onClick={redirectToResetPassword} className={styles.link}>
                Esqueceu sua senha?
              </span>
              <span onClick={redirectToLogin} className={styles.link}>
                Já possui conta? Fazer login
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito: Layout e Navegação */}
      <div className={styles.right}> 
        <img
          src="/imageHome.png"
          alt="Imagem Home"
          className={styles.imageHome}
        />
      </div>
    </section>
  );
}
