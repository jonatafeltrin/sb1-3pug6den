import { Feather } from '@expo/vector-icons';
import { Text } from 'native-base';
import { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ProgramIntern } from '../types/ProgramsDetail';
interface ISlideBar {
  page: ProgramIntern;
  pageCurrent: number;
}
const HeaderCarousel = ({ page, pageCurrent }: ISlideBar) => {
  const scrollViewRef = useRef<ScrollView | undefined>(undefined);

  useEffect(() => {
    if (scrollViewRef?.current) {
      if (pageCurrent > 2) {
        scrollViewRef.current.scrollTo({ x: 300, animated: true });
      } else {
        scrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
    }
  }, [pageCurrent]);

  return (
    <View>
      {page?.headerTitle && (
        <Text color="blue.900" fontSize={20} fontWeight="normal" m={4}>
          {page?.headerTitle}
        </Text>
      )}
      {page?.description && (
        <Text color="blue.900" fontSize={18} fontWeight="light" m={4}>
          {page?.description}
        </Text>
      )}
      {page?.categoryInfo && (
        <View style={{ marginLeft: 16 }}>
          <Text color="blue.900" fontSize={12} fontWeight="normal">
            {page?.categoryInfo?.infoText}
          </Text>
          <Text color="blue.900" fontSize={32} fontWeight="bold">
            {page?.categoryInfo?.category}
          </Text>
          <Text color="#757575" fontSize={12} fontWeight="normal">
            {page?.categoryInfo?.expiration}
          </Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollViewRef}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            minWidth: '100%',
            padding: 16,
          }}>
          {page?.cards.map((item, index) => {
            return (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#7E6D4B',
                  width: 110,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <Text color="#7E6D4B" textBreakStrategy="highQuality" textAlign="center" mb={2}>
                  {item.headerText}
                </Text>
                <View
                  style={[
                    styles.circle,
                    index == pageCurrent ? styles.circleBg : styles.circleWithoutBg,
                  ]}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <Text color="blue.900" fontSize={20} fontWeight="normal" m={4}>
        {page?.contentTitle}
      </Text>

      {page.title == 'Categorias' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <Text style={{ fontSize: 20, color: '#121A78' }}>Benefícios das categorias</Text>
          <Feather name="flag" size={20} color="#121A78" />
        </View>
      )}
    </View>
  );
};

export default HeaderCarousel;

const styles = StyleSheet.create({
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7E6D4B',
    marginBottom: -6,
  },
  circleWithoutBg: {
    backgroundColor: '#fff',
  },
  circleBg: {
    backgroundColor: '#7E6D4B',
  },
});
