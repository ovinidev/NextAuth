/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { GetServerSidePropsContext } from 'next';

export function setupApiClient(ctx: GetServerSidePropsContext) {
  const { token, refreshToken } = parseCookies(ctx);
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

                setCookie(ctx, 'token', token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                setCookie(ctx, 'refreshToken', refreshToken, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                // @ts-ignore
                axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

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
        } else {
          destroyCookie(ctx, 'token');
          destroyCookie(ctx, 'refreshToken');
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
}
