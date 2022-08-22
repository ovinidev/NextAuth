/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError } from 'axios';
import { Credentials, UserInfo, UserInfoByToken } from '../interface/login';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';

const { token, refreshToken } = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: any = [];

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (error.response?.data.code === 'token.expired') {
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          axiosInstance
            .post('/refresh', {
              refreshToken,
            })
            .then((response) => {
              const { token, refreshToken } = response.data;

              setCookie(undefined, 'token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
              });

              setCookie(undefined, 'refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
              });

              setHeadersToken(token);

              failedRequestsQueue.forEach((request: any) =>
                request.onSuccess(token),
              );
              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request: any) =>
                request.onFailed(err),
              );
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
              resolve(axiosInstance(originalConfig));
            },
            onFailed: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export async function login(body: Credentials) {
  const { data } = await axiosInstance.post<UserInfo>('sessions', body);

  return data;
}

export async function getUserDataClient() {
  const { data } = await axiosInstance.get<UserInfoByToken>('me');

  return data;
}

export function setHeadersToken(token: string) {
  // @ts-ignore
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

export async function updateToken(refreshToken: string) {
  const { data } = await axiosInstance.post<UserInfo>('refresh', {
    refreshToken,
  });

  return data;
}
