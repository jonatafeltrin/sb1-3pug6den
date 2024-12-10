import useSWR from 'swr';

import { API_BFF } from '@/services/api';
import { EventsResponse } from '@/types/Event';
import { ApiRoutesEnum } from '@/enums';

async function requestAllEvents() {
  try {
    const { data } = await API_BFF.get<EventsResponse>(ApiRoutesEnum.EVENTS);
    return data;
  } catch {
    throw new Error('Não foi possível obter os eventos');
  }
}

export default function useEvents() {
  const {
    data: EventResponse,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useSWR('/events', requestAllEvents, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const events = EventResponse?.records ?? [];

  return {
    events,
    isLoadingEvents,
    errorEvents,
  };
}
