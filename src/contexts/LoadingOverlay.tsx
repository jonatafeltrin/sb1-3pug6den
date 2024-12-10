// components/LoadingOverlay.js
import React, { createContext, useContext, useMemo, useState } from 'react';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';

// Criar um contexto para controlar o estado global de loading
interface LoadingContext {
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext({} as LoadingContext);

const useLoading = () => {
  return useContext(LoadingContext);
};

const LoadingOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const value: LoadingContext = useMemo(() => {
    return {
      hideLoading,
      showLoading,
    };
  }, []);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <SpinnerOverlay visible={loading} />
    </LoadingContext.Provider>
  );
};

export { useLoading, LoadingOverlayProvider };
