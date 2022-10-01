import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getUserData, login, setHeadersToken } from '../api';
import { Credentials, UserInfo } from '../interface/login';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import { useToasting } from './useToast';

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  singOut(): void;
  accountInfo: UserInfo;
};

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [accountInfo, setAccountInfo] = useState({} as UserInfo);
  const { push } = useRouter();
  const { toastFailedLogin, toastSuccessLogin } = useToasting();

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      console.log(message);

      if (message.data === 'logout') {
        console.log('deslogou');
      }
    };
  }, []);

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
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setHeadersToken(token);

      toastSuccessLogin();
      push('/home');
    } catch (err: any) {
      toastFailedLogin(err.response?.data?.message);
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

    destroyCookie(undefined, 'token');
    destroyCookie(undefined, 'refreshToken');

    authChannel.postMessage('logout');

    push('/');
  }

  useEffect(() => {
    const { token, refreshToken } = parseCookies();

    if (token && refreshToken) {
      (async function getData() {
        const { permissions, roles } = await getUserData();
        setAccountInfo({
          permissions: permissions,
          refreshToken: refreshToken,
          token: token,
          roles: roles,
          isAuthenticated: true,
        });
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
