import * as WebBrowser from 'expo-web-browser';

import * as S from './styles';

import { ENV } from '@/@constants';
import { Action, AppBar } from '@/components';
export const Account = () => {
  const handleToDeleteAccount = async () => await WebBrowser.openBrowserAsync(ENV.DELETE_ACCOUNT!);
  const handleToRequestForm = async () => await WebBrowser.openBrowserAsync(ENV.REQUEST_FORM_URL!);
  return (
    <>
      <AppBar variant="secondary"> Conta</AppBar>
      <S.AccounContainer>
        <Action onPress={handleToDeleteAccount}>Excluir Conta</Action>
        <Action onPress={handleToRequestForm}>Formulário de solicitação de alteração</Action>
      </S.AccounContainer>
    </>
  );
};
