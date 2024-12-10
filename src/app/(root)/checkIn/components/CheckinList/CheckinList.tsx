import { SectionList } from 'native-base';
import { useDeferredValue, useEffect, useState } from 'react';
import { SectionListData } from 'react-native';
import useSWR from 'swr';

import { styles } from './checkIn.styles';
import CheckinSectionFooter from './components/CheckinSectionFooter';
import CheckinSectionHeader from './components/CheckinSectionHeader';
import ListHeaderComponent from './components/ListHeaderComponent';
import EventItem from '../EventItem';
import StoreItem from '../StoreItem';

import { AppBar } from '@/components';
import { useAuth } from '@/contexts/auth';
import { CheckInService } from '@/services';
import { Event } from '@/types/Event';
import { IStore } from '@/types/Store';

export default function CheckinList() {
  const { locationData } = useAuth();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filteredStores, setFilteredStores] = useState<IStore[]>([]);
  const [inputValue, setInputValue] = useState('');
  const deferredValue = useDeferredValue(inputValue);
  const swr = useSWR('/events-and-stores', () =>
    CheckInService.makeEventsAndStores(
      locationData?.coords?.latitude,
      locationData?.coords?.longitude,
    ),
  );

  const events = swr?.data?.events ?? [],
    stores = swr?.data?.stores ?? [];
  useEffect(() => {
    if (!deferredValue) {
      setFilteredEvents([]);
      setFilteredStores([]);
      return;
    }
    setFilteredEvents(
      events.filter((event) => event.Name.toLowerCase().includes(deferredValue.toLowerCase())),
    );
    setFilteredStores(
      stores.filter(
        (store) =>
          store.name.toLowerCase().includes(deferredValue.toLowerCase()) ||
          store.address.toLowerCase().includes(deferredValue.toLowerCase()),
      ),
    );
  }, [deferredValue]);
  const sections: SectionListData<
    Event | IStore,
    { title: string; emptyMessage: string; loadingState: boolean }
  >[] = [
    {
      data: deferredValue ? filteredEvents : events,
      renderItem: ({ item }) => <EventItem item={item as Event} styles={styles.itemList} />,
      title: 'Eventos',
      emptyMessage: 'Não encontramos nenhum evento!',
      loadingState: swr?.isLoading || swr?.isValidating,
      keyExtractor: (item) => (item as Event).Id,
    },
    {
      data: deferredValue ? filteredStores : stores,
      renderItem: ({ item }) => <StoreItem item={item as IStore} styles={styles.itemList} />,
      title: 'Lojas',
      emptyMessage: 'Não encontramos nenhuma loja!',
      loadingState: swr?.isLoading || swr?.isValidating,
      keyExtractor: (item) => (item as IStore).id,
    },
  ];

  return (
    <>
      <AppBar screen="tab">Check-in</AppBar>

      <SectionList
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 16,
          minHeight: '100%',
        }}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={<ListHeaderComponent handleOnSearchChange={setInputValue} />}
        renderSectionHeader={CheckinSectionHeader}
        renderSectionFooter={CheckinSectionFooter}
        sections={sections}
      />
    </>
  );
}
