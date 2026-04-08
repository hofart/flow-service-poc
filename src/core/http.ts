import axios from 'axios';
import { getMockSettings } from 'shared/utils/mock';
import { getAccessToken } from 'shared/utils/localStorage';

const { mockEnabled, bffUrl } = getMockSettings();

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

const baseURL =
  mockEnabled === 'true'
    ? `${window.location.origin}/api`
    : bffUrl || VITE_API_URL;

export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

