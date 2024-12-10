import moment from 'moment';
import { Text, View } from 'native-base';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { styles } from './ExtractFilterModal.styles';
import { ExtractDateFilterProps } from './ExtractFilterModal.types';

import { DatePicker } from '@/components';
import Tag from '@/components/Tag';
import { FilterExtractOptions } from '@/types/Extract';

const DateInputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DatePickerWrapper = styled.View`
  flex: 1;
  margin-right: 8px;
`;

function ExtractFilterModal({
  toggleFilterModal,
  startDateFilter,
  endDateFilter,
  onApplyStartDateFilter,
  onApplyEndDateFilter,
}: ExtractDateFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('Mais recentes');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string | undefined>(startDateFilter);
  const [customEndDate, setCustomEndDate] = useState<string | undefined>(endDateFilter);

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setShowDatePicker(false);

    if (filter === 'Mais recentes') {
      const startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    } else if (filter === 'Mais antigos') {
      const startDate = '2000-01-01';
      const endDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    } else if (filter === 'Personalizar') {
      setShowDatePicker(true);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleApplyFilter = () => {
    if (selectedFilter === 'Personalizar') {
      const formattedStartDate = customStartDate
        ? moment(customStartDate).format('YYYY-MM-DD')
        : '';
      const formattedEndDate = customEndDate ? moment(customEndDate).format('YYYY-MM-DD') : '';
      onApplyStartDateFilter(formattedStartDate);
      onApplyEndDateFilter(formattedEndDate);
    } else {
      onApplyStartDateFilter(customStartDate);
      onApplyEndDateFilter(customEndDate);
    }
    toggleFilterModal();
  };

  return (
    <View
      style={{
        width: '100%',
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
      }}>
      <Text style={{ fontWeight: '400', fontSize: 18, textAlign: 'center', lineHeight: 21.6 }}>
        Período de visualização
      </Text>
      <Text
        style={{
          fontWeight: '300',
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 19.2,
          marginBottom: 10,
        }}>
        Selecione abaixo e organize a visualização
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        testID="tag-scroll"
        style={{ marginBottom: 20 }}>
        {FilterExtractOptions.map((filter) => (
          <Tag
            filter
            key={filter.value}
            active={selectedFilter === filter.value}
            text={filter.label}
            onPress={() => handleSelectFilter(filter.value)}
          />
        ))}
      </ScrollView>

      {showDatePicker && (
        <View style={{ width: '100%' }}>
          <DateInputContainer>
            <DatePickerWrapper>
              <DatePicker
                label="Começando em"
                name="customStartDate"
                value={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
              />
            </DatePickerWrapper>
            <DatePickerWrapper>
              <DatePicker
                label="Até a data de"
                name="customEndDate"
                value={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
              />
            </DatePickerWrapper>
          </DateInputContainer>
        </View>
      )}

      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
        <Text style={{ color: '#fff' }}>Aplicar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={toggleFilterModal}>
        <Text style={{ color: '#2e3de0' }}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ExtractFilterModal;
