import { AxiosResponse } from 'axios';
import moment from 'moment';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import useSWR from 'swr';

import ExtractStatements from './components/ExtractStatements';
import ExtractToExpirePoints from './components/ExtractToExpirePoints';

import { useAuth } from '@/contexts/auth';
import useStores from '@/hooks/useStores';
import { API_BFF } from '@/services/api';
import { ExtractBody, IExtractResponse } from '@/types/Extract';

export default function Page() {
  const { user } = useAuth();
  const cpf = user?.profile?.cpf;
  const email = user?.profile?.email;

  const defaultStartDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
  const defaultEndDate = moment().format('YYYY-MM-DD');

  const [startDateFilter, setStartDateFilter] = useState<string | undefined>(defaultStartDate);
  const [endDateFilter, setEndDateFilter] = useState<string | undefined>(defaultEndDate);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Total de pontos' },
    { key: 'second', title: 'Pontos a vencer' },
  ]);

  const { stores } = useStores();
  const layout = useWindowDimensions();

  async function requestExtract(document: string, date_start?: string, date_end?: string) {
    try {
      const response = await API_BFF.post<ExtractBody, AxiosResponse<IExtractResponse>>(
        '/user/extract',
        {
          document,
          date_start: startDateFilter,
          date_end: endDateFilter,
        },
      );
      return response.data;
    } catch {
      Alert.alert('Houve um erro ao obter os dados do extrato');
    }
  }
  const { data, isLoading } = useSWR(
    ['/statement', startDateFilter, endDateFilter, cpf],
    () => requestExtract(cpf as string, startDateFilter, endDateFilter),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data?.resume) {
          setExtractTotalPoitns(data.resume.balance);
        }
      },
    },
  );

  const [extractTotalPoints, setExtractTotalPoitns] = useState<number | undefined>(0);

  function handleChangeTypeFilter(filter: string | undefined) {
    setTypeFilter(filter);
  }

  function handleChangeStartDateFilter(filter: string | undefined) {
    setStartDateFilter(filter);
  }

  function handleChangeEndDateFilter(filter: string | undefined) {
    setEndDateFilter(filter);
  }

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'first':
        return (
          <ExtractStatements
            data={data?.content}
            resume={data?.resume}
            toExpirePoints={data?.toExpirePoints}
            email={email as string}
            extractTotalPoints={extractTotalPoints}
            isLoading={isLoading}
            stores={stores}
            typeFilter={typeFilter}
            onChangeTypeFilter={handleChangeTypeFilter}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            onApplyStartDateFilter={handleChangeStartDateFilter}
            onApplyEndDateFilter={handleChangeEndDateFilter}
          />
        );
      case 'second':
        return (
          <ExtractToExpirePoints email={email as string} toExpirePoints={data?.toExpirePoints} />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      style={styles.tabBar}
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#000',
    height: 50,
    borderBottomColor: '#ddd',
  },
  indicatorStyle: {
    backgroundColor: '#090D3D',
    padding: 1.5,
    marginBottom: -2,
  },
});

const renderTabBar = (props: any) => {
  return (
    <TabBar
      {...props}
      renderLabel={({ focused, route }) => {
        return <Text color={focused ? 'BLACK' : 'GRAY3'}>{route.title}</Text>;
      }}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
    />
  );
};
