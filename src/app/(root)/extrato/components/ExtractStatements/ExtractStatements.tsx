import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import moment from 'moment';
import { Box, Heading, Text, VStack, HStack, Spinner, FlatList } from 'native-base';
import React, { useState } from 'react';
import { Alert, TouchableWithoutFeedback } from 'react-native';

import { ExtractStatementsProps } from './ExtractStatements.props';
import { styles } from './ExtractStatements.styles';
import DetailModal from '../DetailModal/DetailModal';
import ExtractFilterModal from '../ExtractFilterModal';
import ExtractItem from '../ExtractItem';

import { ENV } from '@/@constants';
import { AppBar } from '@/components';
import Tag from '@/components/Tag/Tag';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';
import { filterTypeOptions, IExtractContentResponse, ExtractFilterTypes } from '@/types/Extract';
import { formatToBRL } from '@/utils/formatUtils';
import { maskValue } from '@/utils/maskValue';

export default function ExtractStatements({
  extractTotalPoints,
  stores,
  email,
  isLoading,
  data = [],
  typeFilter,
  onChangeTypeFilter,
  startDateFilter,
  endDateFilter,
  onApplyStartDateFilter,
  onApplyEndDateFilter,
  resume,
  toExpirePoints,
}: ExtractStatementsProps) {
  const context = useAuth();
  const [isLoadingRedeemCode, setIsLoadingRedeemCode] = useState<boolean>(false);
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(false);
  const [itemToShowDetails, setItemToShowDetails] = useState<IExtractContentResponse | undefined>(
    undefined,
  );
  const [isDateFilterModalVisible, setDateFilterModalVisible] = useState(false);

  const handleToggleLoading = (loading: boolean) => {
    setIsLoadingFilter(loading);
  };
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
    } finally {
      setIsLoadingRedeemCode(false);
    }
  }

  function handleChangeItemToShowDetail(item: IExtractContentResponse) {
    setItemToShowDetails(item);
  }

  const toggleDateFilterModal = () => {
    setDateFilterModalVisible(!isDateFilterModalVisible);
  };

  const closeFilterModal = () => {
    setDateFilterModalVisible(false);
  };

  const currentCategory = resume?.category
    ? resume?.category.charAt(0).toUpperCase() + resume?.category.slice(1).toLowerCase()
    : '';

  const nextCategory = resume?.nextCategory
    ? resume?.nextCategory.charAt(0).toUpperCase() + resume?.nextCategory.slice(1).toLowerCase()
    : '';
  const toNextCategoryFrequency = resume?.purchaseFrequencyValue;
  const toNextCategoryValue = resume?.valueToNextCategory;

  const toNextCategoryFrequencyNumber = parseInt(toNextCategoryFrequency?.toString() ?? '0', 10);
  const toNextCategoryValueNumber = parseFloat(toNextCategoryValue?.toString() ?? '0');

  const showValue = toNextCategoryValueNumber !== 0;
  const showFrequency = toNextCategoryFrequencyNumber > 0;
  const isAtMaxLevel = !nextCategory || nextCategory.toString() === '';
  const formattedToNextCategoryValue = showValue ? formatToBRL(toNextCategoryValueNumber) : '';

  const filteredData = data.filter((item) => {
    if (typeFilter === ExtractFilterTypes.RECEBIDO) {
      return item.isReceived === ExtractFilterTypes.RECEBIDO;
    }

    if (typeFilter === undefined) {
      return true;
    }
    return item.filter === typeFilter;
  });

  const renderHeader = () => (
    <>
      <AppBar screen="tab">Extrato</AppBar>

      <Box margin={4} borderWidth={1} rounded="lg" overflow="hidden" borderColor="#ddd" padding={4}>
        <VStack justifyContent="space-between">
          <VStack marginBottom={4}>
            <Heading size="xs" ml="-1">
              Saldo de pontos
            </Heading>
            <Heading size="xl" ml="-1" color="#121A78" marginBottom={4}>
              {maskValue(extractTotalPoints?.toString() ?? '-')}
            </Heading>
            <Text style={styles.defaultText} fontSize="xs" marginBottom={2}>
              Você está na categoria <Text style={{ fontWeight: 'bold' }}>{currentCategory}</Text>
              {!isAtMaxLevel && (showFrequency || showValue) && (
                <>
                  {'\n'}
                  Faltam{' '}
                  {showFrequency && (
                    <>
                      <Text style={{ fontWeight: 'bold' }}>{toNextCategoryFrequency}</Text>{' '}
                      frequências
                      {showValue && ' e '}
                    </>
                  )}
                  {showValue && (
                    <>
                      {(!showFrequency || toNextCategoryFrequencyNumber === 0) && ' '}
                      <Text style={{ fontWeight: 'bold' }}>{formattedToNextCategoryValue}</Text>
                    </>
                  )}{' '}
                  para <Text style={{ fontWeight: 'bold' }}>{nextCategory}</Text>
                </>
              )}
            </Text>
            <Text style={styles.dateText} fontSize="xs">
              Atualizado em{' '}
              <Text style={{ fontWeight: 'bold' }}>{moment().format('DD/MM/YY')}</Text> às{' '}
              <Text style={{ fontWeight: 'bold' }}>{moment().format('HH:mm')}</Text>
            </Text>
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
            {isLoadingRedeemCode ? (
              'Carregando...'
            ) : (
              <>
                Resgatar pontos <Feather name="chevron-right" size={15} />
              </>
            )}
          </Text>
        </VStack>
      </Box>

      <VStack padding={4}>
        <HStack justifyContent="space-between" alignItems="center" marginBottom={4}>
          <Text fontSize="xl" color="#121A78">
            Visualizar
          </Text>
          <Tag text="Filtrar" onPress={toggleDateFilterModal} active filter />
        </HStack>

        <FlatList
          data={filterTypeOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: filter }) => (
            <Tag
              key={filter.value}
              active={typeFilter === filter.value}
              text={filter.label}
              onPress={() => onChangeTypeFilter(filter.value)}
            />
          )}
          keyExtractor={(item) => item.value ?? ''}
        />
      </VStack>
    </>
  );

  const renderItem = ({ item }: { item: IExtractContentResponse }) => (
    <ExtractItem
      resume={resume}
      toExpirePoints={toExpirePoints}
      item={item}
      onPress={() => handleChangeItemToShowDetail(item)}
    />
  );

  return (
    <>
      <FlatList
        data={filteredData}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={() => {}}
        ListFooterComponent={isLoading ? <Spinner color="#121A78" /> : null}
      />
      <DetailModal
        key={itemToShowDetails?.id}
        stores={stores}
        itemToShowDetails={itemToShowDetails}
        setItemToShowDetails={setItemToShowDetails}
        resume={resume}
        toExpirePoints={toExpirePoints}
      />

      {isDateFilterModalVisible && (
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <ExtractFilterModal
            toggleFilterModal={toggleDateFilterModal}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            onApplyStartDateFilter={onApplyStartDateFilter}
            onApplyEndDateFilter={onApplyEndDateFilter}
            onToggleLoading={handleToggleLoading}
            isLoadingFilter={isLoadingFilter}
          />
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
