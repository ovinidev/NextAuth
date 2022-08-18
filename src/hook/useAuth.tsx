import { createContext, ReactNode, useContext, useState } from 'react';
import { Credentials } from '../interface/login';

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Toda função assíncrona retornará uma promise automaticamente
  async function signIn({ email, password }: Credentials) {
    console.log({ email, password });
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
