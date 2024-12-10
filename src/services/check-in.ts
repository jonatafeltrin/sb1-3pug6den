import { API_BFF } from './api';

import { ApiRoutesEnum } from '@/enums';
import { EventsResponse } from '@/types/Event';
import { IStore } from '@/types/Store';
const submit = <T>(target: string, data: T) =>
  API_BFF.post(`${ApiRoutesEnum.CHECK_IN}/${target}`, data);

export const makeEventsAndStores = async (lat: number | undefined, long: number | undefined) => {
  const [eventsResponse, storesResponse] = await Promise.all([
    API_BFF.get<EventsResponse>(ApiRoutesEnum.EVENTS),
    API_BFF.get<IStore[]>(ApiRoutesEnum.STORES, {
      params: {
        lat: lat ? lat.toString() : '',
        long: long ? long.toString() : '',
      },
    }),
  ]);
  return {
    stores: storesResponse?.data,
    events: eventsResponse?.data?.records,
  };
};
const services = {
  submit,
  makeEventsAndStores,
};
export default services;
