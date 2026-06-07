import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number; email: string; lastName: string; firstName: string;
  org: string; role: string; points: number;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: any) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => { if (d.user) setUser(d.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const r = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const d = await r.json();
    if (d.error) return d.error;
    localStorage.setItem('token', d.token);
    setUser(d.user);
    return null;
  }

  async function register(data: any) {
    const r = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const d = await r.json();
    if (d.error) return d.error;
    localStorage.setItem('token', d.token);
    setUser(d.user);
    return null;
  }

  function logout() { localStorage.removeItem('token'); setUser(null); }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
