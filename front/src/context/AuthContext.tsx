"use client";

import React, { createContext, useContext } from "react";
import useAuth from "@/hook/useAuth";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  user?: User;
  authenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStatus, loading } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        user: authStatus.user,
        authenticated: authStatus.authenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
