/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { Credentials, UserInfo } from '../interface/login';
import { parseCookies, setCookie } from 'nookies';

const { token } = parseCookies();

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function login(body: Credentials) {
  const { data } = await axiosInstance.post<UserInfo>('sessions', body);

  return data;
}

export async function getUserData() {
  const { data } = await axiosInstance.get<UserInfo>('me');

  return data;
}

export function setHeadersToken(token: string) {
  // @ts-ignore
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

export async function updateUserData(refreshToken: string) {
  const { data } = await axiosInstance.post<UserInfo>('refresh', {
    refreshToken,
  });

  return data;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (error.response?.data.code === 'token.expired') {
        const { refreshToken } = parseCookies();
        const { token, refreshToken: newRefreshToken } = await updateUserData(
          refreshToken,
        );

        setCookie(undefined, 'token', token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/', // Quais caminhos da aplicação tem acesso ao cookie, / = tudo
        });

        setCookie(undefined, 'refreshToken', newRefreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/', // Quais caminhos da aplicação tem acesso ao cookie, / = tudo
        });

        setHeadersToken(token);
      } else {
        //logout
      }
    }
  },
);
