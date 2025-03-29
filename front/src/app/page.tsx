"use client";

import useAuth from "@/hook/useAuth";
import LoginPage from "@/components/LoginPage/LoginPage";
import Business from "@/components/Business/Business";

export default function Home() {
  const { authStatus, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return authStatus.authenticated ? <Business /> : <LoginPage />;
}
