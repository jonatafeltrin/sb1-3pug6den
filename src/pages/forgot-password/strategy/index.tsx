import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useTheme } from 'styled-components/native';
import useSWR from 'swr';

import * as S from './styles';

import { AppBar } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { MessageIcon } from '@/custom-icons/message';
import { PhoneIcon } from '@/custom-icons/phone';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { ForgotPasswordService } from '@/services';

export const ForgotPasswordStrategy = () => {
  const params = useLocalSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const onSubmit = async (method: 'sms' | 'email') => {
    const formData = { username: params.username, method };
    try {
      showLoading();
      await ForgotPasswordService.submit({ username: params.username, method });
      router.push({
        pathname: RoutesEnum.FORGOT_PASSWORD_VERIFICATION_CODE,
        params: { ...params, ...formData },
      });
    } catch (e) {
      const error = e as TError;
      Alert.alert(
        'Alerta',
        error?.response?.data?.errors?.[0]?.message ||
          'Não conseguimos enviar seu código de verificação.',
      );
    }
    hideLoading();
  };
  const theme = useTheme();
  const [hasError, setHasError] = useState('');
  const swr = useSWR(
    ApiRoutesEnum.ACCOUNT_OPTIONS,
    () => ForgotPasswordService.accountOptions(params.username),
    {
      onSuccess: (data) => {
        hideLoading();
        return data;
      },
      onError: (e: TError) => {
        setHasError(e?.response?.data?.errors?.[0]?.message);
        hideLoading();
      },
    },
  );
  useEffect(() => {
    showLoading();
  }, []);
  const options = swr.data?.data;

  return (
    <>
      <AppBar>Recuperação de conta</AppBar>

      <S.Container>
        <Text color="blue.950" fontSize={hasError ? 16 : 20} my="24px">
          {hasError || 'Escolha uma forma para receber o código de segurança'}
        </Text>

        <FlatList
          ItemSeparatorComponent={S.Divider}
          data={[
            {
              Component: () => (
                <S.Action onPress={() => onSubmit('sms')}>
                  <PhoneIcon />
                  <S.Box>
                    <Text fontSize={18}>SMS</Text>
                    <Text color="#4D4D4D" width="80%">
                      É mais rápido recuperar a sua conta pelo celular
                    </Text>
                  </S.Box>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color={theme.colors.blue['900']}
                    style={{ marginLeft: 'auto' }}
                  />
                </S.Action>
              ),
              shouldShow: options?.shouldShowPhoneOption,
            },
            {
              Component: () => (
                <S.Action onPress={() => onSubmit('email')}>
                  <MessageIcon />
                  <S.Box>
                    <Text fontSize={18}>E-mail</Text>
                    <Text width="80%" color="#4D4D4D">
                      Você receberá o código nos emails cadastrados
                    </Text>
                  </S.Box>

                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color={theme.colors.blue['900']}
                    style={{ marginLeft: 'auto' }}
                  />
                </S.Action>
              ),
              shouldShow: options?.shouldShowEmailOption,
            },
          ].filter((item) => item.shouldShow)}
          renderItem={({ item: { Component } }) => <Component />}
        />
      </S.Container>
    </>
  );
};
