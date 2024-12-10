import React from 'react';
import SearchBar from './SearchBar';
import { Text } from 'react-native';

function ListHeaderComponent({
  handleOnSearchChange,
}: {
  handleOnSearchChange: (search: string) => void;
}) {
  return (
    <>
      <SearchBar onChangeSearch={handleOnSearchChange} />
      <Text
        style={{
          color: '#121A78',
          paddingTop: 32,
          paddingBottom: 8,
          fontSize: 20,
          fontWeight: '400',
        }}>
        Próximo a você
      </Text>
    </>
  );
}

export default ListHeaderComponent;
