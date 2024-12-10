import { router } from 'expo-router';
import { Text } from 'native-base';
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { Banners } from '../types/Programs';
interface IBanner {
  banner: Banners;
}
const Banner = ({ banner }: IBanner) => {
  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() =>
        router.push({
          pathname: '/programsdetail',
          params: { path: banner.name },
        })
      }>
      <Image source={{ uri: banner.image }} alt="" width={146} height={136} borderRadius={8} />
      <View style={styles.placeholder} />
      <Text position="absolute" bottom={2} color="white" left={2}>
        {banner.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Banner;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    opacity: 0.6,
    borderRadius: 8,
  },
});
