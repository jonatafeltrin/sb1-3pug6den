import Feather from '@expo/vector-icons/Feather';
import { Box, Divider, Text } from 'native-base';
import React from 'react';
import { View, Image } from 'react-native';

import { Cards } from '../types/ProgramsDetail';

interface ICard {
  indexMain: number;
  item: Cards;
}
export default function card({ indexMain, item }: ICard) {
  const hasWhite = item.background == '#818181';
  return (
    <View style={{ flex: 1 }}>
      <Box
        backgroundColor={item.background ? item.background : 'white'}
        testID={String(indexMain)}
        key={indexMain}
        m={4}
        rounded={8}
        shadow="5"
        flex="1">
        <Text
          mt={4}
          color={hasWhite ? '#FFF' : '#7E6D4B'}
          textAlign="center"
          fontSize={24}
          mb={0}
          fontWeight={300}>
          {item?.title}
        </Text>
        <Text textAlign="center" color="#73706A">
          {item.isSoon ? 'Em Breve!' : ''}
        </Text>
        <Text
          mx={4}
          mb={6}
          fontSize={16}
          color={hasWhite ? '#FFF' : '#73706A'}
          textBreakStrategy="highQuality"
          textAlign="center">
          {item?.description}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            height: '50%',
            flex: 1,
          }}>
          {item?.steps?.map((step, index) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent:
                    item.steps.length == 1 && indexMain == 0 ? 'center' : 'space-between',
                  height: '50%',
                  flex: 1,
                }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                  <View style={{ width: 80 }}>
                    <Text color="#73706A">{step.label}</Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 20,
                      width: '75%',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: index == 0 ? (step?.partnersImages ? '70%' : 200) : 150,
                        borderLeftWidth: 1,
                        borderColor: '#73706A',
                      }}
                    />
                    <View style={{ paddingHorizontal: 16 }}>
                      <Text
                        color="#73706A"
                        textBreakStrategy="highQuality"
                        textAlign="center"
                        style={{ textAlign: 'left' }}>
                        {step.value}
                      </Text>

                      {step?.partnersImages && (
                        <View>
                          <Text mt={2} color="#73706A">
                            Parceiros:
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              gap: 16,
                              marginVertical: 16,
                            }}>
                            {step?.partnersImages?.map((partner: any) => {
                              return (
                                <View
                                  style={{
                                    width: 42,
                                    height: 42,
                                  }}>
                                  <Image
                                    source={{ uri: partner }}
                                    style={{ width: 42, height: 42 }}
                                    resizeMode="contain"
                                  />
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={{ flexDirection: 'column', marginTop: 16 }}>
            {item?.infos?.map((info) => {
              return (
                <>
                  <View
                    style={{
                      marginVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 16,
                    }}>
                    <View style={{ flexDirection: 'column', width: '70%' }}>
                      <Text color={hasWhite ? '#FFF' : 'blue.950'} fontSize={14}>
                        {info.label}
                      </Text>
                      <Text color={hasWhite ? '#FFF' : 'gray.800'}>{info.labelDescription}</Text>
                    </View>
                    <Text color={hasWhite ? '#FFF' : 'gray.900'} fontSize={14}>
                      {info.value}
                    </Text>
                    {!info.value && (
                      <Feather
                        color={hasWhite ? '#FFF' : 'gray.800'}
                        size={20}
                        name={info.checked ? 'check' : 'minus'}
                      />
                    )}
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Divider w="90%" />
                  </View>
                </>
              );
            })}
          </View>
        </View>
      </Box>
    </View>
  );
}
