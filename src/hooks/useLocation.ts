import { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth';
export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject>();
  const context = useAuth();
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync();
        //TODO: Remover o location do Auth e começar a usar esse hook onde precise da localização do usuário.
        context.location(location);
        setLocation(location);
      }
    })();
  }, []);
  return {
    location,
  };
};
