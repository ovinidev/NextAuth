/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { GetServerSidePropsContext } from 'next';
import { AuthTokenError } from '../errors/AuthTokenError';

export function requestsWithSSR(ctx: GetServerSidePropsContext) {
  const { token } = parseCookies(ctx);
  let isRefreshing = false;
  let failedRequestsQueue: any = [];

  const axiosInstanceSSR = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axiosInstanceSSR.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { refreshToken } = parseCookies(ctx);

      if (error.response?.status === 401) {
        if (error.response?.data.code === 'token.expired') {
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            axiosInstanceSSR
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
                axiosInstanceSSR.defaults.headers.Authorization = `Bearer ${token}`;

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
                resolve(axiosInstanceSSR(originalConfig));
              },
              onFailed: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstanceSSR;
}
