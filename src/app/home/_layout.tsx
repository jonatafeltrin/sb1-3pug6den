import React from 'react';
import { Tabs, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text } from 'native-base';
import { Alert, AppState, Platform } from 'react-native';
import { ApiRoutesEnum, EXPO_PUSH_PERMISSION, RoutesEnum, StorageEnum } from '@/enums';
import { ENV } from '@/@constants';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useAuth } from '@/contexts/auth';
import { HomeIcon, ListIcon, LocationIcon, StarIcon, TagIcon } from '@/custom-icons';
import { API_BFF } from '@/services/api';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const notificationRedirect: Record<string, string> = {
  rewards: RoutesEnum.EXTRATO,
  info_experiencia_exclusiva: RoutesEnum.EXTRATO,
};

export default function RootLayout() {
  const { showLoading, hideLoading } = useLoading();
  const context = useAuth();
  const tabs = [
    {
      title: 'Início',
      icon: HomeIcon,
      name: 'index',
    },
    {
      title: 'Extrato',
      name: 'extrato',
      icon: ListIcon,
    },
    {
      title: 'Check-in',
      name: 'check-in',
      icon: LocationIcon,
    },
    {
      title: 'Resgate',
      name: 'redeem',
      icon: TagIcon,
      onPress: async () => {
        try {
          showLoading();
          const { data } = await API_BFF.post(ApiRoutesEnum.REDEEM_TOKEN, {
            email: context.user?.profile?.email,
          });
          const propontoToken = data.token;
          await WebBrowser.openBrowserAsync(`${ENV.CATALOGO_URL}${propontoToken}`);
          hideLoading();
        } catch {
          Alert.alert('Ops, não foi possível completar o resgate dos pontos');
          hideLoading();
        }
      },
    },
    {
      title: 'Programa',
      name: 'program',
      icon: StarIcon,
    },
  ];
  const isIos = Platform.OS === 'ios';

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    (async () => {
      const type = lastNotificationResponse?.notification.request.content.data?.type;
      const redirect = type ? notificationRedirect[type] : null;
      if (redirect && (await context.getUser())) {
        console.debug(redirect);
        router.push(redirect);
      }
    })();
  }, [lastNotificationResponse]);

  async function checkIfChangeNotificationPermission() {
    const previousStatus = await SecureStore.getItemAsync(StorageEnum.ACCEPTED_NOTIFICATIONS);

    const { status } = await Notifications.getPermissionsAsync().catch(() => ({
      status: 'failed',
    }));

    const document = JSON.parse(await context.getUser())?.profile?.cpf;

    if (previousStatus === status || !document) return;

    let currentStatus = status;

    if (status === EXPO_PUSH_PERMISSION.UNDETERMINED) {
      currentStatus = (await Notifications.requestPermissionsAsync()).status;
    }

    await SecureStore.setItemAsync(StorageEnum.ACCEPTED_NOTIFICATIONS, currentStatus);

    let requestBody: {
      shouldSendPush?: boolean;
      expoPushToken?: string;
      document: string;
    } = {
      document,
      shouldSendPush: false,
    };

    if (currentStatus === EXPO_PUSH_PERMISSION.GRANTED) {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
        .then((response) => {
          requestBody.expoPushToken = response.data;
        })
        .catch(() => {});

      requestBody.shouldSendPush = true;
    }

    Promise.allSettled([API_BFF.put(ApiRoutesEnum.UPDATE_NOTIFICATION_PREFERENCES, requestBody)]);
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkIfChangeNotificationPermission();
      }
    });

    checkIfChangeNotificationPermission();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: isIos ? 24 : 6,
          height: isIos ? 80 : 60,
          paddingLeft: 10,
          paddingRight: 10,
        },
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          name={tab.name}
          key={tab.name}
          listeners={() => ({
            tabPress: (e) => {
              if (tab.onPress) {
                context.ensureCompleteAccount(tab.onPress, 'shouldCompleteAccountBeforeRedeem')();
                e.preventDefault();
                return;
              }
              return e;
            },
          })}
          options={{
            title: tab.title,
            tabBarIcon: (props) => <tab.icon fill={props.focused ? '#D7DAF9' : undefined} />,
            tabBarLabel: () => <Text fontSize="14px">{tab.title}</Text>,

            tabBarLabelStyle: {
              marginTop: 0,
            },
          }}
        />
      ))}
    </Tabs>
  );
}
