import { createContext, useContext, useState } from 'react';

export const Context = createContext<any>({});
//TODO: Remover esses any
export const ProfileFormProvider = ({ children }: any) => {
  const [values, setValues] = useState<any>();

  return <Context.Provider value={{ values, setValues }}>{children}</Context.Provider>;
};

export const useProfileForm = () => useContext(Context);
