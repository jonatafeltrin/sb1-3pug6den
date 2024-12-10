import { FlatList, Spinner, Text, View } from 'native-base';
import React, { useState } from 'react';

import { styles } from './ExtractList.styles';
import { ExtractListProps } from './ExtractList.types';
import ExtractItem from '../ExtractItem';

import { IExtractContentResponse } from '@/types/Extract';

const messages = {
  1: 'Você não possui check-in nos últimos 6 meses',
  2: 'Você não possui transações nos últimos 6 meses.',
  3: 'Você não possui transações nos últimos 6 meses.',
};
export default function ExtractList({
  isLoading,
  statements = [],
  tab,
  onShowItemDetail,
  resume,
  toExpirePoints,
}: ExtractListProps) {
  const message =
    messages[tab as keyof typeof messages] || 'Não foi possível encontrar nenhum resultado!';
  const [visibleItems, setVisibleItems] = useState(10);
  const loadMoreItems = () => {
    if (visibleItems < statements.length) {
      setVisibleItems((prev) => prev + 10);
    }
  };

  const renderItem = ({ item }: { item: (typeof statements)[0] }) => (
    <ExtractItem item={item} onPress={() => onShowItemDetail(item)} />
  );
  return (
    <View style={{ flexDirection: 'column', gap: 0, marginVertical: 24 }}>
      {isLoading ? (
        <Spinner color="#121A78" />
      ) : !statements.length ? (
        <Text style={styles.withoutResultText} testID="extract-message">
          {message}
        </Text>
      ) : (
        <FlatList
          data={statements.slice(0, visibleItems)}
          renderItem={renderItem}
          keyExtractor={(item: IExtractContentResponse, index: number) =>
            item.id || index.toString()
          }
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            visibleItems < statements.length ? <Spinner color="#121A78" /> : null
          }
        />
      )}
    </View>
  );
}
