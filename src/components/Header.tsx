import React from 'react';
import { View, Image } from 'react-native';

interface IHeader {
  white?: boolean;
}
export default function Header({ white }: IHeader) {
  const logo = white ? require('../assets/logobranca.png') : require('../assets/logoazul.png');
  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ borderLeftWidth: 5, paddingLeft: 10, borderColor: white ? '#fff' : '' }}>
        <Image source={logo} style={{ width: 150, height: 80, objectFit: 'contain' }} />
      </View>
    </View>
  );
}
