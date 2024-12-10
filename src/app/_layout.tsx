import { Stack, SplashScreen, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import JailMonkey from 'jail-monkey';
import { NativeBaseProvider } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, View } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { SWRConfig } from 'swr/_internal';

import { STATUSBAR_LIGHT_ROUTES } from '@/@constants';
import { LoadingOverlayProvider } from '@/contexts/LoadingOverlay';
import { AuthProvider } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import { useNotification } from '@/hooks/useNotification';
import { API_BFF } from '@/services/api';
import { THEME } from '@/theme';
import { checkExpiresIn } from '@/utils';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  useNotification();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    checkExpiresIn();
    setAppIsReady(true);
  }, []);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { UIPasteBoard } = require('uipasteboard');
      UIPasteBoard.setText(' ');
    }
  }, []);
  useEffect(() => {
    async function onFetchUpdateAsync() {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      }
    }
    onFetchUpdateAsync();
  }, []);

  useEffect(() => {
    if (!__DEV__) {
      (async () => {
        if (JailMonkey.isJailBroken()) {
          Alert.alert(
            'Alerta',
            'Desative Jailbreak para continuar utilizando o app.',
            [{ text: 'Ok', onPress: () => BackHandler.exitApp() }],
            {
              cancelable: false,
            },
          );
        }
        if (JailMonkey.canMockLocation()) {
          Alert.alert(
            'Alerta',
            'Desative a localização setada para continuar utilizando o app.',
            [{ text: 'Ok', onPress: () => BackHandler.exitApp() }],
            {
              cancelable: false,
            },
          );
        }
        if (JailMonkey.trustFall()) {
          Alert.alert(
            'Alerta',
            'Seu dispositivo tem o ambiente comprometido.',
            [{ text: 'Ok', onPress: () => BackHandler.exitApp() }],
            {
              cancelable: false,
            },
          );
        }
        if ((await JailMonkey.isDebuggedMode()) === true) {
          Alert.alert(
            'Alerta',
            'Desative o modo de debug para continuar utilizando o app.',
            [{ text: 'Ok', onPress: () => BackHandler.exitApp() }],
            {
              cancelable: false,
            },
          );
        }
      })();
    }
  }, []);
  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 300);
    }
  }, [appIsReady]);
  const pathname = usePathname();
  if (!appIsReady) {
    return null;
  }
  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <StatusBar style={STATUSBAR_LIGHT_ROUTES.find((i) => pathname === i) ? 'light' : 'dark'} />
      <LoadingOverlayProvider>
        <SWRConfig
          value={{ fetcher: API_BFF.get, shouldRetryOnError: false, revalidateOnFocus: false }}>
          <AuthProvider>
            <ThemeProvider theme={THEME}>
              <NativeBaseProvider theme={THEME}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name={RoutesEnum.SIGNUP_MODAL}
                    options={{
                      presentation: 'transparentModal',
                      contentStyle: {
                        backgroundColor: 'rgba(140, 140, 140, 0.5)',
                      },
                    }}
                  />
                  <Stack.Screen
                    name={RoutesEnum.FACE_ID_MODAL}
                    options={{
                      presentation: 'transparentModal',
                      contentStyle: {
                        backgroundColor: 'rgba(140, 140, 140, 0.5)',
                      },
                    }}
                  />
                </Stack>
              </NativeBaseProvider>
            </ThemeProvider>
          </AuthProvider>
        </SWRConfig>
      </LoadingOverlayProvider>
    </View>
  );
}
