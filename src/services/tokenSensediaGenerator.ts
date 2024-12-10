import axios from 'axios';
import { Buffer } from 'buffer';
import * as SecureStore from 'expo-secure-store';

import { ENV } from '@/@constants';

const apiSensediaToken = axios.create({
  baseURL: ENV.URL_TOKEN,
});

export const requestToken = async () => {
  try {
    const keys = ENV.CLIENT_ID + ':' + ENV.SECRET_ID;
    const encodedKeys = Buffer.from(keys).toString('base64');
    const header = {
      headers: { Authorization: 'Basic ' + encodedKeys },
    };

    const token = await apiSensediaToken.post('', { grant_type: 'client_credentials' }, header);
    const expirationTime = new Date();
    expirationTime.setMilliseconds(expirationTime.getMilliseconds() + token.data?.expires_in);
    SecureStore.setItemAsync('expirationTimeToken', expirationTime.toString());
    SecureStore.setItemAsync('API_TOKEN', token.data?.access_token);
    return token;
  } catch {
    // Alert.alert('Alerta', 'Houve um erro ao acessar os dados do aplicativo');
    console.log('erro token');
  }
};
