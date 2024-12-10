import { Text, View } from 'native-base';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import useSWR from 'swr';

import Banner from './Banner';
import { Program } from './types/Programs';
import { useLoading } from '../../../contexts/LoadingOverlay';

import { AppBar } from '@/components';
import { API_BFF } from '@/services/api';
import React from 'react';

export default function Page() {
  const { showLoading, hideLoading } = useLoading();

  const { data, error, isLoading } = useSWR('/institutional/v2', async (url) => {
    const response = await API_BFF.get(url);
    const data: Program[] = response.data;
    return data;
  });
  if (isLoading) {
    showLoading();
  } else {
    hideLoading();
  }
  if (error) {
    Alert.alert('Alerta', 'Erro ao carregar os programas');
  }
  return (
    <>
      <AppBar screen="tab">Programa</AppBar>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingLeft: 16,
          paddingRight: 16,
        }}>
        {data?.map((item: Program) => {
          return (
            <View>
              <Text mt={4} fontSize="2xl" color="blue.900">
                {item.title}
              </Text>
              <Text fontSize="md" color="gray.500">
                {item.description}
              </Text>
              <ScrollView
                horizontal
                style={styles.scrollViewStyle}
                showsHorizontalScrollIndicator={false}>
                {item?.banners.map((banner) => {
                  return <Banner banner={banner} />;
                })}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: { paddingTop: 16, marginBottom: 40 },
});
