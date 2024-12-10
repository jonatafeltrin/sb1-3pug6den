import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import useSWR from 'swr';
import CategoryComponent from './components/Category/Category';
import HeaderPage from './components/HeaderPage/HeaderPage';
import SecondaryEmailModal from './components/SecondaryEmailModal';
import ExtractItem from '@/app/(root)/extrato/components/ExtractItem';
import { ICategory } from '@/app/(root)/extrato/components/ExtractItem/ExtractItem.types';
import { EnumBFF, IData } from '@/app/(root)/notificacoes/types/Notificacao.types';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { useLocation } from '@/hooks/useLocation';
import { API_BFF } from '@/services/api';
import { IExtractContentResponse } from '@/types/Extract';
import OptInModal from './components/OptInModal';
import BackDays from '../../assets/black-days.png';

export default function Home() {
  const screenWidth = Dimensions.get('window').width;

  const [category, setCategory] = useState<ICategory | undefined>();
  const [lastTransaction, setLastTransaction] = useState<IExtractContentResponse[] | undefined>(
    undefined,
  );
  const { hideLoading } = useLoading();
  const context = useAuth();
  const [currentModalValidation, setCurrentModalValidation] = useState<number>(0);

  useLocation();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        await requestTrackingPermissionsAsync();
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userState = await SecureStore.getItemAsync('user');
      const user = JSON.parse(userState || '{}');

      try {
        const [categoryResponse, latestTransactionResponse] = await Promise.all([
          API_BFF.post<ICategory>('/user/category', { cpf: user?.profile?.cpf }),
          API_BFF.post<IExtractContentResponse[]>('/user/latest-transactions', {
            document: user?.profile?.cpf,
          }),
        ]);

        setCategory(categoryResponse.data);
        setLastTransaction(latestTransactionResponse.data);
      } catch (error) {
        console.error('Erro:', error);
        Alert.alert(
          'Alerta',
          'Não foi possível obter suas informações, por favor, tente novamente mais tarde',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        );
      } finally {
        hideLoading();
      }
    })();
  }, []);
  const swrKey = ApiRoutesEnum.NOTIFICATIONS;

  const { data: notifications } = useSWR<IData[]>(swrKey, async (url: string) => {
    const response = await API_BFF.post(url, { cpf: context.user?.profile.cpf });
    return response.data;
  });

  const hasNotification = !!notifications?.find((item: IData) => item?.status === EnumBFF.NAO_LIDA);

  function handleNextModal() {
    setCurrentModalValidation((prev) => prev + 1);
  }

  return (
    <ScrollView style={{ backgroundColor: '#ffffff' }} testID="home-scroll">
      {[SecondaryEmailModal, OptInModal].map(
        (CurrentModal, index) =>
          index === currentModalValidation && <CurrentModal onAction={handleNextModal} />,
      )}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <HeaderPage category={category} hasNotification={hasNotification} />
        <CategoryComponent category={category} />
        <View style={styles.header}>
          <Text style={styles.title}>Últimas transações</Text>
          {!!lastTransaction?.length && (
            <TouchableOpacity
              style={styles.viewMore}
              onPress={() =>
                router.push({
                  pathname: RoutesEnum.EXTRATO,
                  params: { cpf: context.user?.profile.cpf, email: context.user?.profile.email },
                })
              }>
              <Text style={styles.viewMoreText}>Ver mais</Text>
              <Feather name="chevron-right" size={22} color="#2E3DE0" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.transactions}>
          {lastTransaction?.map((item) => (
            <ExtractItem category={category} item={item} key={item.to_expire_date} />
          ))}
          {lastTransaction?.length === 0 && (
            <View>
              <Heading size="xs" color="gray.500" textAlign="center" mb={16}>
                Não encontramos nenhuma transação!
              </Heading>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: '#121a78',
    fontWeight: '700',
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 18,
    color: '#2E3DE0',
    fontWeight: '400',
    marginRight: 4,
  },
  transactions: {
    flexDirection: 'column',
    marginTop: 24,
  },
});
