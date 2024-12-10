import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, Button } from 'native-base';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import { ProgramIntern } from '../types/ProgramsDetail';

import { RoutesEnum } from '@/enums';
import { handleDownloadAndShare } from '@/services/handleDownloadAndShare';
import { THEME } from '@/theme';

interface IPage {
  page: ProgramIntern;
}

const ButtonComponent = ({ page }: IPage) => {
  const action = page?.action;
  const isArchTrends = page?.name == 'archtrends';
  const isCommunity = page?.name == 'community';
  return (
    <View>
      {action?.variant == 'text' ? (
        <Text color="gray.600" textAlign="center" fontWeight="semibold" fontSize="md">
          {action?.content}
        </Text>
      ) : isArchTrends || isCommunity ? (
        <Button
          color="white"
          backgroundColor="blue.500"
          mx={4}
          borderRadius={30}
          mt={4}
          onPress={async () => {
            if (action.path) {
              if (action?.isDownload) {
                handleDownloadAndShare(action.path, page.name);
              } else {
                await WebBrowser.openBrowserAsync(action.path);
              }
            }
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text fontSize={18} color="white">
              {action?.content}
            </Text>
            <Feather
              name="chevron-right"
              size={18}
              style={{
                color: '#fff',
              }}
            />
          </View>
        </Button>
      ) : (
        <TouchableOpacity
          style={[
            styles.buttonBottom,
            { justifyContent: action?.isDownload ? 'space-between' : 'center' },
          ]}
          onPress={async () => {
            if (action.path) {
              if (action?.isDownload) {
                handleDownloadAndShare(action.path, page.name);
              } else {
                if (!action.path.includes('http')) {
                  router.replace(RoutesEnum.CHECK_IN);
                } else {
                  await WebBrowser.openBrowserAsync(action.path);
                }
              }
            }
          }}>
          <View></View>
          <Text color="white" fontSize={16} fontWeight={'500'}>
            {action?.content}
          </Text>
          <Feather
            name="download"
            size={18}
            style={{
              color: '#fff',
              display: action?.isDownload ? 'flex' : 'none',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  buttonBottom: {
    backgroundColor: THEME.colors.blue[500],
    marginBottom: 64,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    borderRadius: 6,
  },
});
