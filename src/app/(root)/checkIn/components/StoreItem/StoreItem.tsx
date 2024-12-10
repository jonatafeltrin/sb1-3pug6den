import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ChevronRightIcon, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';

import { StoreItemProps } from './StoreItem.types';

import { useAuth } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import encoding from '@/utils/encoding';
import { memo } from 'react';

const StoreItem = ({ item, styles }: StoreItemProps) => {
  const context = useAuth();

  const onSubmit = () => {
    router.push({
      pathname: RoutesEnum.CHECK_IN_CONFIRM,
      params: {
        name: encoding.transformFromUtfToHex(item.name),
        cnpj: item.cnpj,
        latitude: item.lat,
        longitude: item.lng,
        address: encoding.transformFromUtfToHex(item.address),
        type: 'store',
      },
    });
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={styles}
      onPress={context.ensureCompleteAccount(onSubmit)}
      testID={`event-${item.id}`}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flex: 1 }}>
        <View
          style={{
            backgroundColor: '#090D3D',
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="location-outline" size={20} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textTransform: 'capitalize', fontSize: 16, color: '#000' }}>
            {item?.name}
          </Text>

          <Text style={{ flexWrap: 'wrap', fontSize: 14, color: '#4D4D4D' }} numberOfLines={2}>
            {item?.address}
          </Text>
        </View>
      </View>

      <ChevronRightIcon color="#121A78" />
    </TouchableOpacity>
  );
};

export default memo(StoreItem);
