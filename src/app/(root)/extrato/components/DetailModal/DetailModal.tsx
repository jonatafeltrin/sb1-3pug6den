import Feather from '@expo/vector-icons/Feather';
import { AxiosResponse } from 'axios';
import { ChevronLeftIcon, HStack, Heading, Text, VStack, View, Switch } from 'native-base';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { mutate } from 'swr';

import { DetailModalProps } from './DetailModal.types';

import { API_BFF } from '@/services/api';
import { THEME } from '@/theme';
import { UpdateStatusRE, ExtractCheckinStatus } from '@/types/Extract';
import { formatNumber, formatToBRL, toTitleCase } from '@/utils/formatUtils';
import { enumSVG } from '@/utils/svgEnum';

type FeatherIconName = keyof typeof Feather.glyphMap | null;

function DetailModal({
  itemToShowDetails,
  setItemToShowDetails,
  stores,
  resume,
  toExpirePoints,
}: DetailModalProps) {
  const [receivedRE, setReceivedRE] = useState(
    itemToShowDetails?.transactionSales?.isSpecifierRE ?? false,
  );
  const [isUpdatingRE, setIsUpdatingRE] = useState(false);

  async function updateStatusRE(
    document: string,
    numberOrder: string,
    specifierRE: boolean,
  ): Promise<boolean> {
    try {
      const response = await API_BFF.put<UpdateStatusRE, AxiosResponse<boolean>>(
        '/user/extract/update/order-re',
        {
          document,
          numberOrder,
          specifierRE,
        },
      );
      mutate((key) => Array.isArray(key) && key.includes('/statement'), undefined);
      return response.data;
    } catch {
      Alert.alert('Houve um erro ao alterar o status de RE');
      return false;
    }
  }

  const currentStore = useMemo(() => {
    if (!itemToShowDetails) return null;
    const { documentStore } = itemToShowDetails;
    return stores?.find((store) => store.cnpj === documentStore);
  }, [itemToShowDetails, stores]);

  const item = useMemo(() => {
    if (!itemToShowDetails) return null;

    const {
      date,
      point,
      to_expire_date,
      transactionSales,
      transactionCheckin,
      transactionReward,
      filter,
      transactionStatus,
      dateToExpire,
    } = itemToShowDetails;

    let infos: any = [];
    let title = '';
    let type = 'info';
    let showStore = true;
    let isNegative = false;

    let iconRightName: FeatherIconName = null;
    let iconRightColor = '#1E1E1E';
    let statusTextColor = '#1E1E1E';
    let additionalText: string = '';

    function getFormattedPointValue(pointValue: number) {
      const formattedPoint = formatNumber(Math.abs(pointValue));
      return pointValue === 0 ? '0' : isNegative ? `- ${formattedPoint}` : `+ ${formattedPoint}`;
    }

    if (transactionSales) {
      const isCanceled =
        transactionStatus === 'Cancelado' || transactionSales.statusSendSales === 'Cancelado';
      const isAwaitingBilling =
        transactionSales.statusSendSales === 'Aguardando Faturamento' ||
        transactionSales.statusSendSales === 'Aguardando faturamento';
      const isBilled =
        transactionSales.statusSendSales === 'Faturado totalmente' ||
        transactionSales.statusSendSales === 'Faturado';

      const orderNumber = transactionSales.numberOrder ?? '';
      title = `Pedido ${orderNumber}`;
      type = 'money';
      if (isCanceled) {
        statusTextColor = '#E84C31';
        additionalText = 'Cancelado';
        isNegative = true;
        iconRightName = 'x-circle';
        iconRightColor = '#E84C31';
      } else if (isAwaitingBilling) {
        additionalText = 'Aguardando Faturamento';
        isNegative = false;
        iconRightName = 'clock';
        iconRightColor = '#E9D7B4';
      } else if (isBilled) {
        statusTextColor = '#30B47A';
        additionalText = 'Faturado';
        isNegative = false;
        iconRightName = 'check-circle';
        iconRightColor = '#30B47A';
      }

      infos = [
        { label: 'Data', value: date },
        { label: 'Pedido', value: transactionSales.numberOrder },
        {
          label: 'Valor do pedido',
          value: formatToBRL(transactionSales.valueOrder),
        },
        { label: 'Nome do cliente', value: transactionSales.nameCostumer },
      ];

      if (isCanceled) {
        infos.push(
          { label: 'Você recebeu o RE?', value: 'Cancelado' },
          { label: 'Pontos recebidos', value: 'Cancelado' },
          { label: 'Vencimento dos pontos', value: 'Cancelado' },
        );
      } else if (isAwaitingBilling) {
        infos.push(
          { label: 'Você recebeu o RE?', value: 'Após faturamento' },
          { label: 'Pontos recebidos', value: 'Após faturamento' },
          { label: 'Vencimento dos pontos', value: 'Após faturamento' },
        );
      } else if (isBilled) {
        infos.push(
          {
            label: 'Você recebeu o RE?',
            value: (
              <Switch
                onTrackColor="#9AE4C4"
                onThumbColor="#30B47A"
                size="sm"
                isChecked={receivedRE}
                isDisabled={isUpdatingRE}
                onToggle={async () => {
                  if (isUpdatingRE) return;
                  setIsUpdatingRE(true);
                  const newValue = !receivedRE;

                  const document = itemToShowDetails?.document ?? '';
                  const numberOrder = transactionSales.numberOrder ?? '';

                  if (!document || !numberOrder) {
                    Alert.alert('Informações insuficientes para atualizar o status de RE');
                    setIsUpdatingRE(false);
                    return;
                  }

                  const success = await updateStatusRE(document, numberOrder, newValue);
                  if (success) {
                    setReceivedRE(newValue);
                  }
                  setIsUpdatingRE(false);
                }}
              />
            ),
          },
          { label: 'Pontos recebidos', value: getFormattedPointValue(point) },
          { label: 'Vencimento dos pontos', value: to_expire_date },
        );
      }
    } else if (transactionReward) {
      const pointValue = formatNumber(Math.abs(point));
      title = `Resgate de ${pointValue} pontos`;
      type = 'tag';

      const status = transactionReward.status;

      if (
        status === 'Enviada para o Parceiro' ||
        status === 'Aguardando Faturamento' ||
        status === 'Aguardando faturamento'
      ) {
        additionalText = 'Aguardando Faturamento';
        isNegative = true;
        iconRightName = 'clock';
        iconRightColor = '#E9D7B4';
      } else if (status === 'Entregue' || status === 'Faturado') {
        additionalText = 'Faturado';
        isNegative = false;
        iconRightName = 'check-circle';
        iconRightColor = '#30B47A';
        statusTextColor = '#30B47A';
      } else if (status === 'Cancelado') {
        additionalText = 'Cancelado';
        isNegative = true;
        iconRightName = 'x-circle';
        iconRightColor = '#E84C31';
        statusTextColor = '#E84C31';
      }

      infos = [
        { label: 'Data', value: date },
        { label: 'Código do resgate', value: transactionReward.transactionID },
        { label: 'Pontos resgatados', value: getFormattedPointValue(point) },
        { label: 'Itens resgatados', value: transactionReward.description },
      ];
    } else if (transactionCheckin) {
      title = 'Check-in';
      type = 'map';

      const status = transactionCheckin.statusCheckin;

      if (
        status === ExtractCheckinStatus.PROCESSANDO ||
        status === 'Processando' ||
        status === 'PROCESSANDO'
      ) {
        additionalText = 'Processando';
        isNegative = false;
        iconRightName = 'clock';
        iconRightColor = '#E9D7B4';
      } else if (
        status === ExtractCheckinStatus.CONCLUIDO ||
        status === 'Concluído' ||
        status === 'CONCLUIDO'
      ) {
        statusTextColor = '#30B47A';
        additionalText = 'Concluído';
        isNegative = false;
        iconRightName = 'check-circle';
        iconRightColor = '#30B47A';
      } else if (status === 'Cancelado') {
        statusTextColor = '#E84C31';
        additionalText = 'Cancelado';
        isNegative = true;
        iconRightName = 'x-circle';
        iconRightColor = '#E84C31';
      }

      infos = [
        { label: 'Data', value: date },
        { label: 'Pontos recebidos', value: getFormattedPointValue(point) },
        { label: 'Categoria', value: toTitleCase(resume?.category ?? '') },
        { label: 'Vencimento dos pontos', value: to_expire_date },
      ];
    } else if (filter === 'EXPIRADO') {
      title = 'Pontos expirados';
      type = 'info';
      showStore = false;

      isNegative = true;
      additionalText = 'Expirado';
      iconRightName = 'x-circle';
      iconRightColor = '#E84C31';
      statusTextColor = '#E84C31';

      infos = [
        { label: 'Data de expiração', value: dateToExpire ?? date },
        { label: 'Pontos expirados', value: getFormattedPointValue(point) },
      ];
    } else if (transactionStatus === 'Cancelado' || filter === 'CANCELADO') {
      title = 'Detalhes do Cancelamento';
      type = 'info';

      isNegative = true;
      additionalText = 'Cancelado';
      iconRightName = 'x-circle';
      iconRightColor = '#E84C31';
      statusTextColor = '#E84C31';

      infos = [
        { label: 'Data', value: date },
        { label: 'Pedido', value: 'N/A' },
        { label: 'Você recebeu o RE?', value: 'Cancelado' },
        { label: 'Pontos recebidos', value: 'Cancelado' },
        { label: 'Vencimento dos pontos', value: 'Cancelado' },
      ];
    }

    return {
      title,
      type,
      showStore,
      infos,
      iconRightName,
      iconRightColor,
      statusTextColor,
      additionalText,
    };
  }, [itemToShowDetails, receivedRE, resume?.category, isUpdatingRE]);

  const svgXmlData = item?.type ? enumSVG[item.type as keyof typeof enumSVG] : null;

  return (
    <Modal
      animationType="slide"
      visible={!!itemToShowDetails}
      onRequestClose={() => {
        setItemToShowDetails(undefined);
      }}>
      <View style={styles.centeredView}>
        <SafeAreaView style={styles.modalView}>
          <View style={{ marginTop: 50, width: '100%' }}>
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  setItemToShowDetails(undefined);
                }}
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeftIcon />
              </TouchableOpacity>
              <Text fontSize={16}>Detalhe</Text>
              <View style={{ width: 40 }} />
            </HStack>
            {svgXmlData ? (
              <View
                style={{
                  backgroundColor: '#D7DAF9',
                  width: 96,
                  height: 96,
                  borderRadius: 50,
                  marginVertical: 10,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SvgXml xml={svgXmlData} width="50%" height="50%" />
              </View>
            ) : null}
            <Heading style={{ marginBottom: 8, textAlign: 'center' }}>{item?.title}</Heading>

            {item?.additionalText && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}>
                {item.iconRightName && (
                  <Feather
                    name={item.iconRightName}
                    size={16}
                    color={item.iconRightColor}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={{ color: item.statusTextColor, fontSize: 16 }}>
                  {item.additionalText}
                </Text>
              </View>
            )}

            {item?.showStore && currentStore && (
              <View style={styles.storeInfo}>
                <Text style={styles.storeInfoText}>{currentStore.name}</Text>
                <Text style={styles.storeInfoText}>
                  {currentStore.address}, {currentStore.city}
                </Text>
              </View>
            )}
            <VStack space={4} mt={4}>
              {item?.infos.map(({ label, value }: any, index: number) => (
                <HStack
                  key={index}
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexWrap="wrap">
                  <Text fontSize={16} style={{ flex: 1 }}>
                    {label}
                  </Text>
                  {typeof value === 'string' || typeof value === 'number' ? (
                    <Text
                      fontSize={16}
                      style={{ fontWeight: 'bold', flex: 1, textAlign: 'right' }}
                      numberOfLines={0}>
                      {value}
                    </Text>
                  ) : (
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>{value}</View>
                  )}
                </HStack>
              ))}
            </VStack>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default DetailModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalView: {
    width: '100%',
    height: '100%',
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  storeInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  storeInfoText: {
    textAlign: 'center',
    color: THEME.colors.gray[800],
  },
});
