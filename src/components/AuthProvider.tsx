// src/components/AuthProvider.tsx
'use client';
import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  session: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  session: any;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}
