'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '@/types'; // Assuming your User type is here

// Define the shape of the context value
interface AuthContextType {
  session: User | null;
  setSession: Dispatch<SetStateAction<User | null>>;
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
  initialSession: User | null;
}

export default function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<User | null>(initialSession);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}