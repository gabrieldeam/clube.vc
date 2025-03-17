"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser, checkEmailExists } from "../../../services/auth";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    accepted_privacy_policy: false,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      setErrorMessage(error.response?.data?.detail || "Erro ao registrar usuário.");
      setSuccessMessage(null);
    }
  };

  const redirectToLogin = () => {
    router.push(`/auth/login?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          placeholder="Email"
          required
        />
        {errorMessage && (
          <div>
            <p style={{ color: "red" }}>{errorMessage}</p>
            {errorMessage === "Esse email já existe." && (
              <button type="button" onClick={redirectToLogin}>
                Fazer login com esse email
              </button>
            )}
          </div>
        )}
        <input
          type="phone"
          name="phone"
          onChange={handleChange}
          placeholder="Telefone"
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Senha"
          required
        />
        <div>
          <input
            type="checkbox"
            name="accepted_privacy_policy"
            onChange={(e) =>
              setFormData({ ...formData, accepted_privacy_policy: e.target.checked })
            }
            required
          />
          <label> Aceito a política de privacidade</label>
        </div>
        <button type="submit">
          Registrar
        </button>
      </form>
      {errorMessage && (
  <div>
    {errorMessage !== "Esse email já existe." && (
      <>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </>
    )}
  </div>
)}
    </div>
  );
}
