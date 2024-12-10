import { VStack, Text, Divider, View } from 'native-base';
import React from 'react';
import { Image } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';

import ButtonComponent from '../Button';
import { ProgramIntern } from '../types/ProgramsDetail';

interface IProgramIntern {
  page: ProgramIntern;
}
const ProgramInternPattern = ({ page }: IProgramIntern) => {
  const isArchTrends = page?.name == 'archtrends';
  const isCommunity = page?.name == 'community';
  return (
    <View flex={1} flexDirection="column" justifyContent="space-between">
      <View>
        {page?.youtubeVideoId && (
          <YouTubeIframe play={false} videoId={page?.youtubeVideoId} height={200} />
        )}
        {page?.imageUrl && (
          <Image
            source={{ uri: page?.imageUrl }}
            style={{ height: 200, resizeMode: 'cover', width: '100%' }}
          />
        )}
        <VStack mt={4} mx={4}>
          <Text color="blue.950" fontSize="20">
            {page?.subtitle}
          </Text>
          {!isCommunity && <Divider />}
          <Text color="gray.900" my={4} textAlign="left" fontSize={18}>
            {page?.content}
          </Text>
        </VStack>

        {(page?.action.variant === 'text' || isArchTrends) && <ButtonComponent page={page} />}
      </View>

      {page?.action.variant !== 'text' && !isArchTrends && <ButtonComponent page={page} />}
    </View>
  );
};

export default ProgramInternPattern;
