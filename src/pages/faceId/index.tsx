import * as LocalAuthentication from 'expo-local-authentication';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import Recaptcha, { RecaptchaRef } from 'react-native-recaptcha-that-works';

import { ENV } from '@/@constants';
import { AppBar } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';
import { setExpiresIn } from '@/utils';
import React from 'react';

export const FaceId = () => {
  const params = useLocalSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const recaptcha = useRef<RecaptchaRef | null>(null);
  useEffect(() => {
    showLoading();
    (async () => {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (isEnrolled) {
        await LocalAuthentication.authenticateAsync({
          disableDeviceFallback: true,
          fallbackLabel: 'Utilizar código de verificação',
        });
      }
      await setExpiresIn();
      router.replace(RoutesEnum.HOME);
    })();

    hideLoading();
  }, []);

  const onVerifyRecaptcha = async (recaptchaToken: string) => {
    showLoading();
    const formData = {
      username: params.username,
      password: params.password,
      recaptchaToken,
    };
    try {
      const response = await API_BFF.post(ApiRoutesEnum.SIGNIN, formData);
      router.replace({
        pathname: RoutesEnum.TWO_FACTOR,
        params: { skip: true, idUser: response.data.profile.id },
      });
    } catch {
      //Se caso der algum erro aqui vou redirecionar para Home
      await setExpiresIn();
      router.replace(RoutesEnum.HOME);
    }
    hideLoading();
  };

  return (
    <>
      <AppBar>Face ID</AppBar>

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
