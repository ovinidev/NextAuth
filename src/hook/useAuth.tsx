import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getUserData, login, setHeadersToken } from '../api';
import { Credentials, UserInfo } from '../interface/login';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  singOut(): void;
  accountInfo: UserInfo;
};

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [accountInfo, setAccountInfo] = useState({} as UserInfo);
  const { push } = useRouter();

  // Toda função assíncrona retornará uma promise automaticamente
  async function signIn({ email, password }: Credentials) {
    try {
      const { permissions, refreshToken, roles, token } = await login({
        email,
        password,
      });

      setAccountInfo({
        permissions: permissions,
        refreshToken: refreshToken,
        token: token,
        roles: roles,
        isAuthenticated: true,
      });

      setCookie(undefined, 'token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/', // Quais caminhos da aplicação tem acesso ao cookie, / = tudo
      });

      setCookie(undefined, 'refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/', // Quais caminhos da aplicação tem acesso ao cookie, / = tudo
      });

      setHeadersToken(token);
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  }

  function singOut() {
    setAccountInfo({
      permissions: [''],
      refreshToken: '',
      token: '',
      roles: [''],
      isAuthenticated: false,
    });

    push('/');
  }

  useEffect(() => {
    const { token } = parseCookies();

    if (token) {
      (async function getData() {
        try {
          const { permissions, refreshToken, roles, token } =
            await getUserData();
          setAccountInfo({
            permissions: permissions,
            refreshToken: refreshToken,
            token: token,
            roles: roles,
            isAuthenticated: true,
          });
        } catch (err: any) {
          console.log('erro');
        }
      })();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        singOut,
        accountInfo,
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
