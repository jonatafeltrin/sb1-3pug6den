import { Redirect, Stack } from 'expo-router';
import { Text } from 'native-base';

import { useAuth } from '../../contexts/auth';
import { AsyncStorageService } from '../../services/asyncStorage';

import { RoutesEnum } from '@/enums';

export default function AppLayout() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  (async () => {
    const user: any = await AsyncStorageService;

    if (!user) {
      return <Redirect href="/intro" />;
    }
  })();

  return (
    <Stack>
      <Stack.Screen name="home/index" />
      <Stack.Screen name="checkIn/index" />
      <Stack.Screen name="checkinConfirm" />
      <Stack.Screen
        name="notificacoes/index"
        options={{ title: 'Notificações', headerShadowVisible: false }}
      />
      <Stack.Screen
        name="modalCheckin"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={RoutesEnum.CHECK_IN_MODAL}
        options={{
          presentation: 'transparentModal',

          contentStyle: {
            backgroundColor: 'rgba(140, 140, 140, 0.5)',
          },
        }}
      />
    </Stack>
  );
}
