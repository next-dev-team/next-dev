import React, { createContext, useContext, useMemo, useState } from 'react';

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signIn = async (email: string, _password: string) => {
    // Demo-only auth: accept any credentials
    setUser({ email });
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, signIn, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}