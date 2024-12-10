import { MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Button, Checkbox, Text } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';

import * as S from './styles';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/auth';

import { ENV } from '@/@constants';
import { AppBar, Input, KeyBoardAvoidingContainer, Recaptcha, RecaptchaRef } from '@/components';
import { RoutesEnum, StorageEnum } from '@/enums';
import { SigninSchema } from '@/schemas';

export const Signin = () => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const recaptcha = useRef<RecaptchaRef>({} as RecaptchaRef);
  const [allowedFaceId, setAllowedFaceId] = useMMKVBoolean(StorageEnum.ALLOWED_FACE_ID);
  const form = useForm<{ username: string; password: string }>({
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit',
    resolver: yupResolver(SigninSchema),
  });
  useEffect(() => {
    (async () => {
      const username = (await SecureStore.getItemAsync('username')) as string;
      form.setValue('username', username?.trim?.());
    })();
  }, []);

  const onVerifyRecaptcha = (recaptchaToken: string) => {
    const values = form.getValues();
    signIn(values.username, values.password, recaptchaToken);
  };
  const handleSignup = () => router.push(RoutesEnum.SIGNUP);

  return (
    <>
      <AppBar> </AppBar>
      <KeyBoardAvoidingContainer keyboardVerticalOffset={80}>
        <S.Container keyboardShouldPersistTaps="always">
          <Header />
          <S.TabsContainer>
            <S.TabContainer isActive>
              <S.Tab isActive>Login</S.Tab>
            </S.TabContainer>
            <S.TabContainer onPress={handleSignup}>
              <S.Tab testID="signup-tab">Cadastrar</S.Tab>
            </S.TabContainer>
          </S.TabsContainer>

          <FormProvider {...form}>
            <S.Form>
              <Input
                placeholder=""
                label="CPF ou e-mail"
                onChangeText={(text) => form.setValue('username', text.trim())}
                name="username"
                textContentType="emailAddress"
                autoComplete="email"
              />
              <Input
                placeholder=""
                label="Senha"
                secureTextEntry={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
                contextMenuHidden
                name="password"
                textContentType="password"
                autoComplete="password"
                icon={
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#9B9B9B"
                  />
                }
              />
            </S.Form>
          </FormProvider>
          <Link style={{ marginLeft: 16 }} href={RoutesEnum.FORGOT_PASSWORD}>
            <Text color="blue.600" fontWeight={600}>
              Não lembra da sua senha ?
            </Text>
          </Link>
          {Platform.OS === 'ios' && (
            <Checkbox
              onChange={setAllowedFaceId}
              value=""
              marginLeft="16px"
              isChecked={allowedFaceId}
              my="16px"
              _text={{ color: 'grey.550' }}
              colorScheme="blue"
              color="red"
              style={{ borderColor: '#2E3DE0' }}>
              Utilizar o Face ID
            </Checkbox>
          )}
        </S.Container>
        <S.BottomContainer>
          <Button
            bgColor="blue.500"
            width="100%"
            onPress={form.handleSubmit(() => recaptcha?.current?.open())}
            testID="signin-button"
            textAlign="center">
            Confirmar
          </Button>
        </S.BottomContainer>
      </KeyBoardAvoidingContainer>
      <Recaptcha
        ref={recaptcha}
        siteKey={ENV.SITE_KEY!}
        baseUrl={ENV.BASE_URL_CAPTCHA!}
        onVerify={onVerifyRecaptcha}
        size="invisible"
      />
    </>
  );
};
