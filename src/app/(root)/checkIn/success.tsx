import { router } from 'expo-router';
import React from 'react';

import { Success } from '@/components';
import { RoutesEnum } from '@/enums';

export default function CkeckInSuccessfully() {
  const onPress = () => router.replace(RoutesEnum.HOME);
  return (
    <>
      <Success
        onPress={onPress}
        header="Check-in realizado com sucesso!"
        title="Você receberá seus pontos em até 48 horas."
        buttonTitle="Voltar para a home"
      />
    </>
  );
}
