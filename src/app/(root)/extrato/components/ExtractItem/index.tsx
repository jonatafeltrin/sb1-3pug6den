import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {
  IExtractItem,
  StatusDetails,
  statusDetailsMap,
  TransactionStatus,
} from './ExtractItem.types';
import { styles } from '../ExtractList/ExtractList.styles';

import { ExtractCheckinStatus, ExtractFilterTypes, actionFilterMessages } from '@/types/Extract';
import { formatNumber, formatToBRL, toTitleCase } from '@/utils/formatUtils';

const ExtractItem = ({ item, onPress, resume, category }: IExtractItem) => {
  const iconStore: keyof typeof Feather.glyphMap = 'map-pin';
  let iconRightName: keyof typeof Feather.glyphMap = 'alert-circle';

  let titleTextColor = '#1E1E1E';
  const titleStoreText = '#868686';
  let footerLeftColor = '#1E1E1E';
  const iconLeftColor = '#868686';
  let iconRightColor = '#1E1E1E';
  let pointsTextColor = '#1E1E1E';
  let statusTextColor = '#1E1E1E';

  let statusText: string = '';
  let additionalText: string = '';
  let isNegative = false;

  const isOrderBilled =
    item.transactionSales?.statusSendSales === TransactionStatus.FATURADO ||
    item.transactionSales?.statusSendSales === TransactionStatus.FATURADO_TOTALMENTE;

  const isSpecifierRE = item?.transactionSales?.isSpecifierRE;
  const tagBackgroundColor = isSpecifierRE ? '#30B47A' : '#F3F3F3';
  const tagTextColor = isSpecifierRE ? '#FCF9F3' : '#868686';
  const tagIconName: keyof typeof Feather.glyphMap | undefined = isSpecifierRE
    ? 'check'
    : undefined;

  const getStatusDetails = (status: string): StatusDetails => {
    return (
      statusDetailsMap[status] || {
        iconName: 'alert-circle',
        iconColor: '#E9D7B4',
        additionalText: 'Processando',
        statusTextColor: '#1E1E1E',
        pointsTextColor: '#1E1E1E',
        isNegative: false,
      }
    );
  };

  if (item.transactionCheckin?.statusCheckin) {
    statusText = item.transactionCheckin.statusCheckin;
    const statusDetails = getStatusDetails(statusText);
    iconRightName = statusDetails.iconName;
    iconRightColor = statusDetails.iconColor;
    additionalText = statusDetails.additionalText;
    statusTextColor = statusDetails.statusTextColor;
    pointsTextColor = statusDetails.pointsTextColor;
    isNegative = statusDetails.isNegative;

    if (statusText === ExtractCheckinStatus.CONCLUIDO) {
    } else if (statusText === TransactionStatus.CANCELADO) {
    }
  } else if (item.transactionReward?.status) {
    statusText = item.transactionReward.status;
    const statusDetails = getStatusDetails(statusText);
    iconRightName = statusDetails.iconName;
    iconRightColor = statusDetails.iconColor;
    additionalText = statusDetails.additionalText;
    statusTextColor = statusDetails.statusTextColor;
    pointsTextColor = statusDetails.pointsTextColor;
    isNegative = statusDetails.isNegative;

    if (
      statusText === TransactionStatus.FATURADO ||
      statusText === TransactionStatus.FATURADO_TOTALMENTE
    ) {
    } else if (statusText === TransactionStatus.CANCELADO) {
    }
  } else if (item.transactionSales?.statusSendSales) {
    statusText = item.transactionSales.statusSendSales;
    const statusDetails = getStatusDetails(statusText);
    iconRightName = statusDetails.iconName;
    iconRightColor = statusDetails.iconColor;
    additionalText = statusDetails.additionalText;
    statusTextColor = statusDetails.statusTextColor;
    pointsTextColor = statusDetails.pointsTextColor;
    isNegative = statusDetails.isNegative;

    if (statusText === TransactionStatus.AGUARDANDO_FATURAMENTO) {
      const statusDetails = getStatusDetails('Faturado');
      iconRightName = statusDetails.iconName;
      iconRightColor = statusDetails.iconColor;
      additionalText = statusDetails.additionalText;
      statusTextColor = statusDetails.statusTextColor;
      pointsTextColor = statusDetails.pointsTextColor;
      isNegative = statusDetails.isNegative;
    }

    if (
      statusText === TransactionStatus.FATURADO ||
      statusText === TransactionStatus.FATURADO_TOTALMENTE
    ) {
    } else if (statusText === TransactionStatus.CANCELADO) {
    }
  }

  if (item.filter === ExtractFilterTypes.RESGATES) {
    isNegative = true;
    pointsTextColor = '#525EE5';
    additionalText = actionFilterMessages[item.filter];
  } else if (item.filter === ExtractFilterTypes.EXPIRADO) {
    isNegative = true;
    pointsTextColor = '#E84C31';
    additionalText = actionFilterMessages[item.filter];
  } else if (item.filter === ExtractFilterTypes.CANCELADO) {
    isNegative = true;
    iconRightName = 'x-circle';
    iconRightColor = '#E84C31';
    pointsTextColor = '#E84C31';
    titleTextColor = '#9B9B9B';
    footerLeftColor = '#9B9B9B';
    additionalText = 'Cancelado';
  }

  const invoiceOrText =
    item?.transactionSales?.numberOrder && item?.transactionSales?.numberOrder.trim() !== ''
      ? item.transactionSales.numberOrder
      : item.filter === ExtractFilterTypes.CHECKIN
        ? 'Check-in'
        : item.filter === ExtractFilterTypes.RESGATES
          ? 'Resgate de pontos'
          : item.filter === ExtractFilterTypes.EXPIRADO
            ? 'Pontos expirados'
            : '';

  const categoryTitle = category?.category?.current_category
    ? toTitleCase(category.category.current_category)
    : resume?.category
      ? toTitleCase(resume.category)
      : '';

  const formattedNameStore = item.nameStore ? toTitleCase(item.nameStore) : '';

  const pointValue = typeof item.point === 'number' && !isNaN(item.point) ? item.point : 0;

  return (
    <TouchableOpacity onPress={onPress} style={styles.transactionCard}>
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          {formattedNameStore !== '' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Feather name={iconStore} size={16} color={iconLeftColor} style={styles.iconStyle} />
              <Text style={[styles.footerDateText, { color: titleStoreText }]}>
                {formattedNameStore}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.titleText, { color: titleTextColor }]}>{invoiceOrText}</Text>
            {isOrderBilled && (
              <View style={[styles.tagContainer, { backgroundColor: tagBackgroundColor }]}>
                {tagIconName && <Feather name={tagIconName} size={12} color={tagTextColor} />}
                <Text style={[styles.tagText, { color: tagTextColor }]}>RE</Text>
              </View>
            )}
          </View>
          <Text style={[styles.footerLeftText, { color: footerLeftColor }]}>
            {categoryTitle} {item.date}
          </Text>
        </View>
      </View>

      <View style={styles.pointContainer}>
        {item.filter !== ExtractFilterTypes.RESGATES &&
          item.filter !== ExtractFilterTypes.EXPIRADO && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name={iconRightName} size={16} color={iconRightColor} />
              <Text style={[styles.statusText, { color: statusTextColor }]}>{additionalText}</Text>
            </View>
          )}

        <Text style={[styles.pointsText, { color: pointsTextColor }]}>
          {pointValue === 0 ? (
            <Text style={{ fontSize: 12, color: 'black', fontWeight: '400' }}>
              Aguardando Processamento
            </Text>
          ) : (
            `${isNegative ? '-' : '+'} ${formatNumber(Math.abs(pointValue))}`
          )}
        </Text>

        {item.filter !== ExtractFilterTypes.RESGATES &&
          item.filter !== ExtractFilterTypes.EXPIRADO &&
          item.transactionSales?.valueOrder !== undefined &&
          item.transactionSales?.valueOrder !== null &&
          !isNaN(item.transactionSales.valueOrder) && (
            <Text style={styles.valuePointsText}>
              {formatToBRL(item.transactionSales.valueOrder)}
            </Text>
          )}
      </View>
    </TouchableOpacity>
  );
};

export default ExtractItem;
