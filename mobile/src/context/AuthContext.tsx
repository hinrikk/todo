import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("token").then(setTokenState);
  }, []);

  async function setToken(token: string | null) {
    setTokenState(token);

    if (token) {
      await SecureStore.setItemAsync("token", token);
    } else {
      await SecureStore.deleteItemAsync("token");
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}