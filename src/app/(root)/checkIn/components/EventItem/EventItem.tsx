import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ChevronRightIcon, Text, View } from 'native-base';

import { EventItemProps } from './EventItem.types';

import { useAuth } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import encoding from '@/utils/encoding';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

function EventItem({ item, styles }: EventItemProps) {
  const context = useAuth();
  const onSubmit = () => {
    router.push({
      pathname: RoutesEnum.CHECK_IN_CONFIRM,
      params: {
        name: encoding.transformFromUtfToHex(item.Name),
        eventId: item.Id,
        address: 'item.address',
        type: 'event',
      },
    });
  };
  return (
    <TouchableOpacity
      key={item.Id}
      style={styles}
      onPress={context.ensureCompleteAccount(onSubmit)}
      testID={`event-${item.Id}`}>
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
            {item?.Name}
          </Text>

          <Text style={{ flexWrap: 'wrap', fontSize: 14, color: '#4D4D4D' }}>Evento</Text>
        </View>
      </View>

      <ChevronRightIcon color="#121A78" />
    </TouchableOpacity>
  );
}

export default memo(EventItem);
