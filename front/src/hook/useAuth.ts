import { useState, useEffect } from "react";
import { verifyToken } from "../services/auth";

interface AuthStatus {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export default function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await verifyToken();
        // O endpoint deve retornar algo como { authenticated: true, user: { ... } } ou { authenticated: false }
        setAuthStatus(data);
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        setAuthStatus({ authenticated: false });
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { authStatus, loading };
}
