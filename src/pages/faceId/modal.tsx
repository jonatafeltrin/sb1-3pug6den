import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useMMKV } from 'react-native-mmkv';

import { Modal } from '@/components';
import { RoutesEnum, StorageEnum } from '@/enums';
import { setExpiresIn } from '@/utils';

export const FaceIdModal = () => {
  const storage = useMMKV();
  const openSettings = async () => {
    await Linking.openSettings();
    await setExpiresIn();
    router.replace(RoutesEnum.HOME);
  };
  const handleCancel = async () => {
    await setExpiresIn();
    storage.set(StorageEnum.ALLOWED_FACE_ID, false);
    router.replace(RoutesEnum.HOME);
  };
  return (
    <Modal
      onConfirm={openSettings}
      onCancel={handleCancel}
      confirmTitle="Abrir configurações"
      cancelTitle="Não utilizar Face ID"
      title="Caso queira utilizar o face ID na próxima vez que entrar, ative nas configurações"
    />
  );
};
