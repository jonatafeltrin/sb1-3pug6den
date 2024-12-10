import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, NativeSyntheticEvent, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';
import { OnPageSelectedEventData } from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent';
import Animated from 'react-native-reanimated';
import useSWR from 'swr';

import Card from './programas/components/card';
import HeaderCarousel from './programas/components/headerCarousel';
import ProgramInternPattern from './programas/programInternPattern';
import { ProgramIntern } from './programas/types/ProgramsDetail';
import { useLoading } from '../../contexts/LoadingOverlay';
import { API_BFF } from '@/services/api';

import { AppBar } from '@/components';
import { useAuth } from '@/contexts/auth';
import { formatName } from '@/utils';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

export default function Page() {
  const [pagecurrent, setPageCurrent] = useState(0);
  const { user } = useAuth();

  const { showLoading, hideLoading } = useLoading();

  const params = useLocalSearchParams();

  const url = `/institutional/v2/info/${params.path}`;
  const { data: page, isLoading } = useSWR(url, async (url) => {
    const response = await API_BFF.post(url, { cpf: user?.profile?.cpf });
    return response.data as ProgramIntern;
  });

  if (isLoading) {
    showLoading();
  } else {
    hideLoading();
  }

  return (
    <>
      <AppBar>{formatName(page?.title) ?? 'Programas'}</AppBar>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ minHeight: '100%', backgroundColor: '#fff' }}>
          {page && (
            <>
              {page?.type !== 'carousel' && <ProgramInternPattern page={page} />}

              {page?.type == 'carousel' && (
                <>
                  <HeaderCarousel page={page} pageCurrent={pagecurrent} />

                  <AnimatedPager
                    testID="pager-view"
                    style={styles.pagerView}
                    initialPage={0}
                    onPageScroll={() => {
                      'worklet';
                    }}
                    onPageSelected={(e: NativeSyntheticEvent<OnPageSelectedEventData>) => {
                      setPageCurrent(e.nativeEvent.position);
                    }}>
                    {page?.cards?.map((item, index) => {
                      return <Card item={item} indexMain={index} />;
                    })}
                  </AnimatedPager>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    height: 650,
    marginBottom: 50,
  },
});
