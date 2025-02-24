"use client";

import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const redirectToForgotPassword = () => {
    router.push(`/auth/forgot-password`);
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <button type="button" onClick={redirectToForgotPassword}>Redefinir senha</button>
    </div>
  );
}
