import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { requestToken } from './tokenSensediaGenerator';
import { XSessionGenerator } from './xsessionGenerator';

import { ENV } from '@/@constants';
import { StorageEnum } from '@/enums';
import { clearSession } from '@/utils';

export const API_BFF = axios.create({
  baseURL: ENV.API_BFF_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API_BFF.interceptors.request.use(async (config) => {
  let sessionToken = await SecureStore.getItemAsync(StorageEnum.X_SESSION_TOKEN);
  let tokenRes = await SecureStore.getItemAsync(StorageEnum.API_TOKEN);
  const expirationToken = await SecureStore.getItemAsync(StorageEnum.SENSEDIA_EXPIRATION_TIME);
  const now = new Date();
  const expirationTimeToken = new Date(expirationToken ?? '');
  if (now > expirationTimeToken || !tokenRes) {
    const response = await requestToken();

    tokenRes = response?.data?.access_token;
  }

  if (!sessionToken) {
    sessionToken = (await XSessionGenerator()) as string;
  }
  config.headers['client_id'] = ENV.CLIENT_ID;
  config.headers['x-session-token'] = sessionToken;
  config.headers['access_token'] = tokenRes;

  return config;
});

API_BFF.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearSession();
    }
    return Promise.reject(error);
  },
);

export default {
  API_BFF,
};
