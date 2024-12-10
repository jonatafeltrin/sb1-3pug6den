import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { AppBar, Modal } from '@/components';
import { useAuth } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import { CheckInService } from '@/services';

export default function CheckInModal() {
  const params = useLocalSearchParams();
  const [isLoading, setLoading] = useState(false);
  const { user } = useAuth();

  const onSubmit = async () => {
    setLoading(true);
    try {
      await CheckInService.submit(params.type as string, {
        cpf: user?.profile?.cpf,
        email: user?.profile.email,
        [params.key as string]: params.id,
        completed_signup: !!user?.profile?.cep,
      });
      router.replace(RoutesEnum.CHECK_IN_SUCCESS);
    } catch (error) {
      const err = error as TError;
      Alert.alert('Alerta', err.response.data.errors[0].message);
      router.back();
    }
    setLoading(false);
  };
  return (
    <>
      <AppBar>Confirmar check-in</AppBar>
      <Modal
        onConfirm={onSubmit}
        confirmTitle="Confirmar"
        isLoading={isLoading}
        title={`Você confirma o seu check-in ${params.message}?`}
      />
    </>
  );
}
