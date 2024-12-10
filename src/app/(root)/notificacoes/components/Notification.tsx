import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button, Text } from 'native-base';
import { ReactNode, useState } from 'react';
import { Alert } from 'react-native';

import { ENV } from '@/@constants';
import { useAuth } from '@/contexts/auth';
import { API_BFF } from '@/services/api';
import { ApiRoutesEnum } from '@/enums';
type Props = {
  title: string | string[] | undefined;
  message: string | string[] | undefined;
  children: ReactNode | ReactNode[];
};
const NotificationRoot = ({ title, message, children }: Props) => {
  return (
    <>
      <Text fontWeight="400" color="blue.800" fontSize="24px">
        {title}
      </Text>
      <Text fontWeight="400" fontSize="18px" color="gray.900" marginTop="16px">
        {message}
      </Text>
      {children}
    </>
  );
};
const NotificationRedirect = () => {
  const params = useLocalSearchParams();
  if (!params.redirectTo) {
    return null;
  }
  return (
    <Button
      bgColor="blue.500"
      marginTop="auto"
      testID="next-button"
      onPress={() => router.push(params.redirectTo as string)}>
      Vamos lá
    </Button>
  );
};
const NotificationRedeem = () => {
  const params = useLocalSearchParams();
  const { processType } = params;
  const expirePoints = processType === 'EXPIRE_POINTS';
  const [isLoadingRedeemCode, setIsLoadingRedeemCode] = useState(false);
  const { user, ensureCompleteAccount } = useAuth();
  async function handleRedeemCode() {
    if (isLoadingRedeemCode) return;
    try {
      setIsLoadingRedeemCode(true);
      const { data } = await API_BFF.post(ApiRoutesEnum.REDEEM_TOKEN, {
        email: user?.profile?.email,
      });
      const propontoToken = data.token;
      await WebBrowser.openBrowserAsync(`${ENV.CATALOGO_URL}${propontoToken}`);
    } catch {
      Alert.alert('Ops, não foi possível completar o resgate dos pontos');
    }
    setIsLoadingRedeemCode(false);
  }
  if (!expirePoints) {
    return null;
  }
  return (
    <Text
      mt={16}
      fontSize="md"
      textAlign="center"
      color="#2e3de0"
      marginBottom={4}
      onPress={ensureCompleteAccount(handleRedeemCode, 'shouldCompleteAccountBeforeRedeem')}>
      {isLoadingRedeemCode ? (
        'Carregando...'
      ) : (
        <Text>
          Resgatar pontos <Feather name="chevron-right" size={15} />
        </Text>
      )}
    </Text>
  );
};
export const Notification = {
  NotificationRoot,
  NotificationRedirect,
  NotificationRedeem,
};
