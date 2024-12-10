import { MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { Button, Text } from 'native-base';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import * as S from './styles';

import { AppBar, Input, KeyBoardAvoidingContainer } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { CheckIcon } from '@/custom-icons/checkIcon';
import { CloseIcon } from '@/custom-icons/close';
import { RoutesEnum } from '@/enums';
import { ForgotPasswordSchema } from '@/schemas';
import { SignupService } from '@/services';

export const SignupPassowrd = () => {
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const values = form.watch();

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
  const context = useProfileForm();
  const { showLoading, hideLoading } = useLoading();
  const onSubmit = async () => {
    const {
      name,
      email,
      cpf,
      phone,
      birthdate,
      acceptedConsentOptionsIds,
      storeInvite,
      friendEmailInvite,
      friendNameInvite,
      storeCNPJ,
    } = context.values.profile;
    const { password } = form.getValues();
    showLoading();
    try {
      const response = await SignupService.submit({
        name,
        email,
        password,
        birthdate,
        acceptedConsentOptionsIds,
        cpf,
        phone,
        storeInvite,
        friendEmailInvite,
        friendNameInvite,
        storeCNPJ,
      });

      router.replace({
        pathname: RoutesEnum.SIGNUP_VERIFY,
        params: { idUser: response?.data?.id, email, password },
      });
    } catch (error) {
      const err = error as TError;
      Alert.alert('Atenção', err?.response?.data?.errors?.[0]?.message);
    }
    hideLoading();
  };

  return (
    <KeyBoardAvoidingContainer keyboardVerticalOffset={60}>
      <AppBar>Definição de senha</AppBar>
      <S.Container>
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
          <S.BottomContainer>
            <Button
              bgColor={!form.formState.isValid ? 'gray.200' : 'blue.500'}
              width="100%"
              marginTop="auto"
              disabled={!form.formState.isValid}
              testID="confirm-button"
              onPress={form.handleSubmit(onSubmit)}
              marginBottom="16px"
              textAlign="center">
              Confirmar
            </Button>
          </S.BottomContainer>
        </FormProvider>
      </S.Container>
    </KeyBoardAvoidingContainer>
  );
};
