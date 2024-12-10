import useSwr from 'swr';

import { API_BFF } from '@/services/api';

import { IStore } from '@/types/Store';
import { ApiRoutesEnum } from '@/enums';

async function requestAllStores(lat?: string, long?: string) {
  try {
    const { data } = await API_BFF.get<IStore[]>(ApiRoutesEnum.STORES, {
      params: {
        lat,
        long,
      },
    });
    return data;
  } catch {
    throw new Error('Não foi possível obter as lojas');
  }
}

function useStores(lat?: string, long?: string) {
  const {
    data: StoreResponse,
    isLoading: isLoadingStores,
    error: errorStores,
  } = useSwr(['/stores', lat, long], () => requestAllStores(lat, long), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const stores = StoreResponse ?? [];

  return {
    stores,
    isLoadingStores,
    errorStores,
  };
}

export default useStores;
