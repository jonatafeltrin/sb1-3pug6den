import { router } from 'expo-router';
import React from 'react';

import { Success } from '@/components';
import { RoutesEnum } from '@/enums';

export default function Screen() {
  const onPress = () => router.replace(RoutesEnum.LOGIN);
  return (
    <>
      <Success
        onPress={onPress}
        title="Seu cadastro foi realizado com sucesso"
        buttonTitle="Ok, entendi"
      />
    </>
  );
}
