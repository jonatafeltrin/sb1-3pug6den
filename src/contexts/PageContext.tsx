import { createContext, useContext, useState } from 'react';

export const PageContext = createContext<any>({});

export const PageProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = {
    isLoading,
    setIsLoading,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePageContext = () => useContext(PageContext);
