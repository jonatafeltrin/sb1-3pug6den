import * as WebBrowser from 'expo-web-browser';
import moment from 'moment';
import { ScrollView, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { styles } from './ExtractToExpirePoints.styles';
import { ExtractToExpirePointsProps } from './ExtractToExpirePoints.types';

import { ENV } from '@/@constants';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';

function ExtractToExpirePoints({ toExpirePoints = [], email }: ExtractToExpirePointsProps) {
  const [isLoadingRedeemCode, setIsLoadingRedeemCode] = useState<boolean>(false);

  const context = useAuth();

  async function handleRedeemCode() {
    if (isLoadingRedeemCode) return;
    try {
      setIsLoadingRedeemCode(true);
      const { data } = await API_BFF.post(ApiRoutesEnum.REDEEM_TOKEN, {
        email,
      });
      const propontoToken = data.token;
      await WebBrowser.openBrowserAsync(`${ENV.CATALOGO_URL}${propontoToken}`);
    } catch {
      Alert.alert('Ops, não foi possível completar o resgate dos pontos');
    }
    setIsLoadingRedeemCode(false);
  }

  return (
    <ScrollView>
      <VStack p={4} pb={8}>
        <Text fontSize={16}>
          Confira os seus pontos a vencer. Após o vencimento você não poderá mais utilizá-los.
        </Text>
        <Text fontSize="xl" color="#121A78" marginBottom={4} marginTop={4}>
          Próximos vencimentos
        </Text>
        <VStack style={{ gap: 8 }} marginBottom={8}>
          {!toExpirePoints.length ? (
            <Text style={styles.withoutResultText}>Você não tem pontos a vencer</Text>
          ) : (
            toExpirePoints.map((item, index) => (
              <TouchableOpacity key={item.id || index.toString()} style={styles.transactionCard}>
                <Text fontWeight={700} fontSize={18}>
                  {moment(item.date).format('DD/MM/YYYY')}
                </Text>
                <Text color="#525EE5" fontSize={18} fontWeight={700}>
                  {item.points}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </VStack>
        <Text
          fontSize="md"
          textAlign="center"
          color="#2e3de0"
          marginBottom={4}
          onPress={context.ensureCompleteAccount(
            handleRedeemCode,
            'shouldCompleteAccountBeforeRedeem',
          )}>
          {isLoadingRedeemCode ? 'Carregando...' : 'Resgatar pontos'}
        </Text>
      </VStack>
    </ScrollView>
  );
}

export default ExtractToExpirePoints;
