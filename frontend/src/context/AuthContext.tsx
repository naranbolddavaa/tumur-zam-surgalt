import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: { lastName: string; firstName: string; org: string; email: string; password: string }) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const d = await api.auth.me();
      setUser(d?.user || null);
    } catch { setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  async function login(email: string, password: string) {
    try {
      const d = await api.auth.login(email, password);
      if (d.error) return d.error;
      localStorage.setItem('token', d.token);
      setUser(d.user);
      return null;
    } catch (e: any) { return e.message; }
  }

  async function register(data: any) {
    try {
      const d = await api.auth.register(data);
      if (d.error) return d.error;
      localStorage.setItem('token', d.token);
      setUser(d.user);
      return null;
    } catch (e: any) { return e.message; }
  }

  function logout() { localStorage.removeItem('token'); setUser(null); }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
