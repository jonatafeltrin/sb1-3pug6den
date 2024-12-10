import { LocationObject } from 'expo-location';
import { SectionListData } from 'react-native';

import { Event } from '@/types/Event';
import { IStore } from '@/types/Store';

export type CheckinListProps = {
  location: LocationObject | null;
};

export type CheckinSectionComponentProps = {
  section: SectionListData<
    Event | IStore,
    {
      title: string;
      emptyMessage: string;
      loadingState: boolean;
    }
  >;
};
