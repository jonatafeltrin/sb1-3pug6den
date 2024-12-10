import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { get } from '@/utils/object';

type Props = {
  placeholder?: string;
  label: string;
  name: string;
  onChange: (date: string | undefined) => void;
  control?: Control;
  value?: string;
};

const Container = styled.View`
  width: 100%;
`;

const ContainerPickDate = styled.View`
  width: 120px;
  background-color: white;
  border-bottom: 1px solid black;
  border-radius: 8px;
  padding: 2px;
`;

const Label = styled.Text`
  font-size: 16px;
  padding: 2px;
  color: #333;
  margin-bottom: 4px;
`;

export const DatePicker = ({ label, name, onChange, value }: Props) => {
  const formContext = useFormContext();
  const errors = formContext?.formState?.errors || {};
  const [textValue, setTextValue] = useState<string | undefined>(
    value ? moment(value).locale('pt-br').format('DD/MM/YYYY') : '',
  );
  const error = get(errors, name);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setTextValue(moment(selectedDate).locale('pt-br').format('DD/MM/YYYY'));
      onChange(formattedDate);
    } else {
      setTextValue('');
      onChange(undefined);
    }
  };

  return (
    <Container>
      <Label>{label}</Label>
      <ContainerPickDate>
        <RNDateTimePicker
          onChange={handleDateChange}
          mode="date"
          value={value ? new Date(value) : new Date()}
          locale="pt-BR"
          display="default"
        />
      </ContainerPickDate>
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
    </Container>
  );
};
