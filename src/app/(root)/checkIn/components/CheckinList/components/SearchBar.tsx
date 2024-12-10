import React from 'react';
import { Text, TextInput } from 'react-native';

function SearchBar({ onChangeSearch }: { onChangeSearch: (search: string) => void }) {
  return (
    <>
      <Text style={{ fontSize: 14, color: '#4d4d4d', fontWeight: '400' }}>Localização</Text>
      <TextInput
        style={{ borderBottomWidth: 1, borderBottomColor: '#1D2BC4', paddingVertical: 20 }}
        onChangeText={onChangeSearch}
      />

      <Text style={{ color: '#4D4D4D', fontSize: 12, marginTop: 10 }}>
        Informe a loja, evento ou endereço
      </Text>
    </>
  );
}

export default SearchBar;
