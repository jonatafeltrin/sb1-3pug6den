import { Text } from 'native-base';
import { ReactNode, useState } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { TextInput, TextInputProps, View } from 'react-native';
import styled from 'styled-components/native';

import { get } from '@/utils/object';

const IconView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Icon = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  height: 48px;
  width: 48px;
  align-items: center;
  justify-content: center;
`;
type Props = {
  name: string;
  error?: string;
  icon?: ReactNode;
  onIconPress?: () => void;
  label: string;
  value?: string | undefined;
  format?: string;
  onChangeText?: (t: string) => void;
} & TextInputProps;
export const Input = ({ name, label, icon, onIconPress, format = '', ...rest }: Props) => {
  const [key, setKey] = useState('');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);
  const onFormat = (text: string) => {
    const value = text.replace(/\D/g, '');
    let formattedNumber = '';
    if (key === 'Backspace') {
      return text.substring(0, text.length);
    }
    for (let i = 0, j = 0; i < format.length && value[j]; i++) {
      if (format[i] === '#') {
        formattedNumber += value[j];
        j++;
      } else {
        formattedNumber += format[i];
      }
    }
    return formattedNumber;
  };
  const handleChange = (text: string, field: ControllerRenderProps<FieldValues, string>) => {
    text = format ? onFormat(text) : text;
    field.onChange(text);
    rest.onChangeText?.(text);
  };
  return (
    <Controller
      control={control as Control}
      name={name}
      render={({ field }) => (
        <View>
          <Text fontWeight={300}>{label}</Text>
          <IconView>
            <TextInput
              {...rest}
              {...field}
              testID={name}
              style={{
                borderBottomWidth: 1,
                marginTop: 0,
                height: 48,
                paddingVertical: 15,
                borderColor: '#090D3D',
                width: '100%',
              }}
              onChangeText={(text) => handleChange(text, field)}
              value={rest.value || field.value}
              onKeyPress={(e) => setKey(e.nativeEvent.key)}
            />
            <Icon onPress={onIconPress}>{icon}</Icon>
          </IconView>

          {error ? <Text color="#E84C31">{error?.message}</Text> : null}
        </View>
      )}
    />
  );
};
