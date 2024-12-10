import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import { Skeleton } from 'native-base';
import React from 'react';
import { View, Text } from 'react-native';

import {
  Card,
  Container,
  HeaderIcons,
  HeaderView,
  InsideContainer,
  Title,
  Icon,
  DefaultText,
  DateText,
} from './styles';
import Header from '../../../../components/Header';

import { ICategory } from '@/app/(root)/extrato/components/ExtractItem/ExtractItem.types';
import { useAuth } from '@/contexts/auth';
import { PersonIconSmall } from '@/custom-icons/person';
import { RoutesEnum } from '@/enums';
import { maskValue } from '@/utils/maskValue';

interface IHeaderPage {
  category: ICategory | undefined;
  hasNotification: boolean;
}

const HeaderPage = ({ category, hasNotification }: IHeaderPage) => {
  const { user } = useAuth();
  const handleToProfile = () => router.push(RoutesEnum.PROFILE);

  const currentCategory = category?.category?.current_category
    ? category.category.current_category.charAt(0).toUpperCase() +
    category.category.current_category.slice(1).toLowerCase()
    : '';

  const nextCategory = category?.category?.next_category
    ? category.category.next_category.charAt(0).toUpperCase() +
    category.category.next_category.slice(1).toLowerCase()
    : '';

  const toNextCategoryFrequency = category?.category?.to_next_category_frequency;
  const toNextCategoryValue = category?.category?.to_next_category;

  const isAtMaxLevel = !nextCategory || nextCategory === '';

  const toNextCategoryFrequencyNumber = parseInt(toNextCategoryFrequency ?? '0', 10);

  const toNextCategoryValueNumber = parseFloat(toNextCategoryValue ?? '0');

  const showValue = toNextCategoryValueNumber !== 0;

  const formattedToNextCategoryValue = showValue ? `R$ ${toNextCategoryValue}` : '';

  const showFrequency = toNextCategoryFrequencyNumber > 0;

  return (
    <Container>
      <InsideContainer>
        <HeaderView>
          <Header white />
          <HeaderIcons>
            <View>
              <Feather
                size={22}
                color="white"
                testID="notification-icon"
                name="bell"
                onPress={() => {
                  router.push('/notificacoes');
                }}
                style={{ marginRight: 16 }}
              />
              {hasNotification && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#30B47A',
                    width: 12,
                    height: 12,
                    right: 16,
                    borderRadius: 6,
                  }}
                />
              )}
            </View>
            <Icon onPress={handleToProfile}>
              <PersonIconSmall />
            </Icon>
          </HeaderIcons>
        </HeaderView>
        <Title testID="user-name">Olá, {user?.profile?.given_name}!</Title>

        <Card>
          <Skeleton.Text isLoaded={!!category?.category?.balance}>
            <Text style={{ fontWeight: '600', fontSize: 14, color: '#4B4B4B', marginBottom: 7 }}>
              Saldo de pontos
            </Text>
            <Text style={{ fontWeight: '700', fontSize: 32, color: '#121A78', marginBottom: 8 }}>
              {category?.category?.balance && maskValue(category?.category?.balance)}
            </Text>
            <DefaultText>
              Você está na categoria <Text style={{ fontWeight: 'bold' }}>{currentCategory}</Text>
              {currentCategory == 'Black'
                ? ''
                : !isAtMaxLevel &&
                (showFrequency || showValue) && (
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
            </DefaultText>
            <DateText>
              Atualizado em{' '}
              <Text style={{ fontWeight: 'bold' }}>{moment().format('DD/MM/YY')}</Text> às{' '}
              <Text style={{ fontWeight: 'bold' }}>{moment().format('HH:mm')}</Text>
            </DateText>
          </Skeleton.Text>
        </Card>
      </InsideContainer>
    </Container>
  );
};

export default HeaderPage;
