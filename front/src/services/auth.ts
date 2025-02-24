import api from "./api";
import { UserCreate, UserLogin } from "../types/user";

// Verifica se o email já existe
export const checkEmailExists = async (email: string) => {
  const response = await api.get(`auth/email-exists?email=${email}`);
  return response.data;
};

// Registrar usuário
export const registerUser = async (user: UserCreate) => {
  const response = await api.post("auth/register", user);
  return response.data;
};

// Verificar email
export const verifyEmail = async (token: string) => {
  const response = await api.get(`auth/verify-email?token=${token}`);
  return response.data;
};

// Login do usuário
export const loginUser = async (user: UserLogin) => {
  const response = await api.post("auth/login", user);
  return response.data;
};

// Solicitar redefinição de senha
export const forgotPassword = async (email: string) => {
  const response = await api.post("auth/forgot-password", { email });
  return response.data;
};

// Redefinir senha
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post("auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return response.data;
};

// Verificar se o email está verificado
export const isEmailVerified = async (email: string) => {
  const response = await api.get(`auth/is-email-verified?email=${email}`);
  return response.data;
};

// Reenviar email de verificação
export const resendVerificationEmail = async (email: string) => {
  const response = await api.post("auth/resend-verification-email", { email });
  return response.data;
};