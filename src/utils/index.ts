import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { ENV } from '@/@constants';
import { RoutesEnum, StorageEnum } from '@/enums';
export const clearSession = async () => {
  //Essas variáveis estão separadas no app e também são geradas em momentos diferentes.
  //Mais tarde podemos ver uma forma de setar todas em um objeto tipo "session"
  await Promise.all([
    SecureStore.deleteItemAsync(StorageEnum.EXPIRES_IN),
    SecureStore.deleteItemAsync(StorageEnum.API_TOKEN),
    SecureStore.deleteItemAsync(StorageEnum.X_SESSION_TOKEN),
    SecureStore.deleteItemAsync(StorageEnum.SENSEDIA_EXPIRATION_TIME),
  ]);
  router.replace(RoutesEnum.INTRO);
};

export const checkExpiresIn = async () => {
  const expiresIn = await SecureStore.getItemAsync(StorageEnum.EXPIRES_IN);
  const isExpired = Number(expiresIn ?? 0) < Date.now();
  if (isExpired) {
    await clearSession();
  } else {
    router.replace(RoutesEnum.HOME);
  }
  return isExpired;
};
export const setExpiresIn = () => {
  const expiresIn = Date.now() + Number(ENV.MAX_AGE);
  return SecureStore.setItemAsync(StorageEnum.EXPIRES_IN, expiresIn.toString());
};
export const formatDate = (date: string) =>
  date
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{0,2})(\d{0,4})$/, (match, day, month, year) =>
      year || month ? `${day}${month ? '/' : ''}${month}${year ? '/' : ''}${year}` : day,
    );
export const formatName = (name = '') => {
  return name
    .split(' ')
    .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`)
    .join(' ');
};
