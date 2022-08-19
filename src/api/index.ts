/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { Credentials, UserInfo } from '../interface/login';
import { parseCookies } from 'nookies';

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

export async function updateUserData() {
  const { data } = await axiosInstance.post('refresh');

  return data;
}
