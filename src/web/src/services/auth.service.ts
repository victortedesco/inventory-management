import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const AUTH_API_URL = import.meta.env.VITE_USERS_API_URL + "/api/v1/auth";

export const login = async (identifier: string, password: string) => {
  const payload = {
    identifier: identifier,
    password: password,
  };

  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok || response.status === 401) {
      toast.error(
        "Identificador ou senha errados. Verifique suas credenciais."
      );
      throw new Error(
        "Identificador ou senha errados. Verifique suas credenciais."
      );
    }

    const token = await response.text();
    localStorage.setItem("token", token);
    toast.success("Login realizado com sucesso!");
    return token;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const decodeToken = (token: string | null) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};

export interface TokenPayload {
  sub: string;
  jti: string;
  name: string;
  exp: number;
}
