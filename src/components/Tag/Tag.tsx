import { Box, Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './Tag.styles';
import { TagProps } from './Tag.types';

export default function Tag({ active, onPress, text, filter, icon }: TagProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        backgroundColor={
          filter && active
            ? '#121A78'
            : active
              ? '#2e3de0'
              : filter && !active
                ? '#ddd'
                : 'transparent'
        }
        borderRadius={25}
        borderWidth={1}
        borderColor={filter && active ? '#121A78' : active ? '#2e3de0' : '#ddd'}
        paddingY={1.5}
        paddingX={4}
        style={styles.tag}>
        <View style={styles.contentContainer}>
          {icon && (
            <Icon
              name={icon.name}
              size={16}
              color={filter ?? active ? '#fff' : filter && !active ? '#9B9B9B' : '#1E1E1E'}
              style={styles.icon}
            />
          )}
          <Text
            color={
              (filter && active) || active ? '#fff' : filter && !active ? '#9B9B9B' : '#1E1E1E'
            }
            testID={text}>
            {text}
          </Text>
        </View>
      </Box>
    </TouchableOpacity>
  );
}
