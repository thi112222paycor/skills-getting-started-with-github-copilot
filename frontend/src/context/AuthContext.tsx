import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { AuthRequest, UserSession } from '../types';

interface AuthContextValue {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (payload: AuthRequest) => Promise<void>;
  register: (payload: AuthRequest) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'task-manager-session';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUser(): UserSession | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? (JSON.parse(saved) as UserSession) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => getInitialUser());

  const persistUser = (session: UserSession | null) => {
    setUser(session);
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (payload) => {
        const session = await api.login(payload);
        persistUser(session);
      },
      register: async (payload) => {
        const session = await api.register(payload);
        persistUser(session);
      },
      logout: () => persistUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
