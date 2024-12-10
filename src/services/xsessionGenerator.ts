import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { ENV } from '@/@constants';
import { ApiRoutesEnum } from '@/enums';
export const XSessionGenerator = async () => {
  const tokenRes = await SecureStore.getItemAsync('API_TOKEN');

  const apiXSessionToken = axios.create({
    baseURL: ENV.API_BFF_URL,
    headers: {
      client_id: ENV.CLIENT_ID,
      access_token: tokenRes,
    },
  });
  try {
    const response = await apiXSessionToken.post<{
      token: string;
    }>(ApiRoutesEnum.CREATE_SESSION);

    const { token } = response.data;

    await SecureStore.setItemAsync('x-session-token', token);
    return token;
  } catch (err: any) {
    console.log(err.response.data, 'session token error');
    // Alert.alert('Não foi possível criar sua sessão, por favor, tente novamente mais tarde');
  }
};
