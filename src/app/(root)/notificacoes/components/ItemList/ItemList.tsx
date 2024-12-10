import moment from 'moment';
import { Box, Checkbox, View } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { styles } from '../../styles';
import { EnumBFF, IData } from '../../types/Notificacao.types';

interface IItemList {
  item: IData;
  onPress: () => void;
  checked?: boolean;
  onCheck: (id: string) => void;
}
const ItemList = ({ item, onPress, onCheck, checked }: IItemList) => {
  const opacityVerify = item.status == EnumBFF.ARQUIVADA || item.status == EnumBFF.LIDA;
  return (
    <View>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} testID={`notification-${item.id}`}>
          <Text style={[styles.titleItem, { color: opacityVerify ? '#868686' : '#121A78' }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.textItem, { color: opacityVerify ? '#868686' : '#393939' }]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.message}
          </Text>
        </TouchableOpacity>
        {item.status !== EnumBFF.DESTAQUE && (
          <View style={styles.checkboxContainer}>
            <Text style={{ ...styles.checkboxDate, color: opacityVerify ? '#868686' : '#121A78' }}>
              {moment(item.date, 'YYYY-MM-DD').format('DD/MM')}
            </Text>
            <Checkbox
              colorScheme="blue"
              onChange={() => onCheck(item.id)}
              isChecked={checked}
              value={item.id}
              accessibilityLabel="Checkbox"
            />
          </View>
        )}
      </Box>
    </View>
  );
};

export default ItemList;
