import { MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Text } from 'native-base';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, SafeAreaView } from 'react-native';

import * as S from './styles';

import { AppBar, Input } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { CheckIcon } from '@/custom-icons/checkIcon';
import { CloseIcon } from '@/custom-icons/close';
import { RoutesEnum } from '@/enums';
import { ForgotPasswordSchema } from '@/schemas';
import { ForgotPasswordService } from '@/services';
import { setExpiresIn } from '@/utils';

export const CreatePassword = () => {
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(ForgotPasswordSchema),
  });
  const params = useLocalSearchParams();
  const values = form.watch();
  const { showLoading, hideLoading } = useLoading();
  const onSubmit = async () => {
    showLoading();
    const formData = params.idUser
      ? {
          key: params.key,
          password: values.password,
          idUser: params.idUser,
        }
      : { key: params.key, password: values.password };
    try {
      await ForgotPasswordService.reset(formData);
      if (params.redirectToHome) {
        await setExpiresIn();
        router.replace(RoutesEnum.HOME);
        return;
      }
      router.replace(RoutesEnum.FORGOT_PASSWORD_SUCCESS);
    } catch (e) {
      const error = e as TError;
      Alert.alert(
        'Alerta',
        error?.response?.data?.errors?.[0]?.message || 'Não foi possível redefinir sua senha',
      );
    }
    hideLoading();
  };

  const Item = ({ children, onError }: { children: string; onError: () => boolean }) => {
    const hasError = onError();

    return (
      <S.Row>
        {values.password ? hasError || !values.password ? <CloseIcon /> : <CheckIcon /> : null}
        <Text
          color={
            values.password ? (hasError || !values.password ? 'red.550' : 'green.950') : 'grey.500'
          }>
          {children}
        </Text>
      </S.Row>
    );
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar>Redefinição de senha</AppBar>
      <S.Container contentContainerStyle={{ flexGrow: 1, paddingBottom: 16, paddingTop: 16 }}>
        {params.redirectToHome && (
          <>
            <Text color="blue.900" fontSize="20px">
              Por favor troque sua senha.
            </Text>
            <Text color="grey.500" fontSize="16px" my="16px">
              Sua senha expira periodicamente como uma medida de segurança proativa. Para continuar
              será necessário definir uma nova senha de acesso.
            </Text>
          </>
        )}
        <FormProvider {...form}>
          <S.Form>
            <Input
              placeholder="******"
              label="Digite a nova senha"
              secureTextEntry={!showPassword}
              onIconPress={() => setShowPassword(!showPassword)}
              name="password"
              icon={
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#9B9B9B"
                />
              }
            />
            <Input
              placeholder="******"
              label="Repita a nova senha"
              secureTextEntry={!showConfirmPassword}
              name="confirmPassword"
              onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              icon={
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#9B9B9B"
                />
              }
            />
          </S.Form>
          <Text fontSize={20} marginBottom="16px" color="grey.500" bold>
            Sua senha deve ter
          </Text>
          <Item onError={() => values.password.length < 8}>8 ou mais caracteres</Item>
          <Item onError={() => !/[A-Z].*[A-Z]/.test(values.password)}>
            2 letras maiúsculas ou mais
          </Item>
          <Item onError={() => !/[a-z]/.test(values.password)}>1 letra minúscula ou mais</Item>
          <Item onError={() => !/[0-9]/.test(values.password)}>1 número ou mais</Item>
          <Item onError={() => !/[!@#$%&*(),.?":{}|<>]/.test(values.password)}>
            1 caractere especial ou mais (Ex: @#$%&...)
          </Item>
          <Item onError={() => values.password !== values.confirmPassword}>
            As senhas devem ser iguais
          </Item>
        </FormProvider>
        <S.BottomContainer>
          <Button
            bgColor={!form.formState.isValid ? 'gray.200' : 'blue.950'}
            testID="confirm-button"
            disabled={!form.formState.isValid}
            textAlign="center"
            onPress={onSubmit}>
            Confirmar
          </Button>
        </S.BottomContainer>
      </S.Container>
    </SafeAreaView>
  );
};
