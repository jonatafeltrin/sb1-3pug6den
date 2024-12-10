import { AxiosError } from 'axios';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Text } from 'native-base';
import { Alert } from 'react-native';
import React from 'react';

import * as S from './styles';

import { AppBar } from '@/components';
import { FaceIDIcon } from '@/custom-icons/faceId';
import { RoutesEnum } from '@/enums';
import { UserService } from '@/services';
import { setExpiresIn } from '@/utils';

export const ConfigFaceId = () => {
  const params = useLocalSearchParams();
  const handleFaceId = async () => {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return Alert.alert(
          'Face ID não configurado',
          'Configure o Face ID no dispositivo para continuar.',
        );
      }
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: true,
        fallbackLabel: 'Utilizar código de verificação',
      });
      if (result.success) {
        const deviceID = await Application.getIosIdForVendorAsync();
        const deviceName = Constants.deviceName || 'Dispositivo desconhecido';
        await UserService.registerDevice({
          access_token: params.access_token,
          deviceID,
          deviceName,
        });
        Alert.alert('Sucesso', 'Face ID habilitado com sucesso.');
        router.replace(RoutesEnum.HOME);
      } else {
        Alert.alert('Erro', 'Autenticação falhou. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao configurar Face ID:', error);
      Alert.alert('Erro', 'Não foi possível configurar o Face ID. Tente novamente.');
    }
  };

  return (
    <>
      <AppBar>Face ID</AppBar>
      <S.Container>
        <S.Content>
          <FaceIDIcon />

          <Text fontSize="lg" bold mt={8}>
            Habilitar Face ID
          </Text>
          <Text fontSize="md" mt={2} textAlign="center" color="gray.300">
            Para fazer um login mais ágil, habilite o uso do face id no app. Ao habilitar você está
            de acordo que a utilização do FaceId é realizada através do Iphone, sem a
            responsabilidade do +arquitetura.
          </Text>
        </S.Content>
        <S.Footer>
          <Button bgColor="blue.500" width="100%" mt={8} onPress={handleFaceId} textAlign="center">
            Ver opções
          </Button>
        </S.Footer>
      </S.Container>
    </>
  );
};
