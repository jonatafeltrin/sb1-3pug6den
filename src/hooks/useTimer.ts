import { useEffect, useState } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { time, setTime };
};
