import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import CheckinList from './components/CheckinList';

export default function CheckIn() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return <CheckinList />;
}
