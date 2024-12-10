import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { Button, Checkbox, Text } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

import * as S from './styles';

import { AppBar, Input, Select } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { useAuth } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import useStores from '@/hooks/useStores';
import { LastFormSchema } from '@/schemas';
import { UserService } from '@/services';

export const LastProfileForm = () => {
  const form = useForm({
    defaultValues: {
      storeInvite: [],
      friendEmailInvite: '',
      friendNameInvite: '',
      storeCNPJ: '',
    } as any,
    resolver: yupResolver(LastFormSchema),
  });

  const handleChange = async (value: string) => {
    const storeInvite = form.getValues().storeInvite;

    if (storeInvite.includes(value)) {
      const filtered = storeInvite.filter((item: string) => item !== value);
      form.setValue('storeInvite', filtered);
    } else if (
      (storeInvite.includes('indicacao') || value.includes('indicacao')) &&
      storeInvite.length <= 1
    ) {
      form.setValue('storeInvite', [...storeInvite, value]);
    } else if (!storeInvite.includes('indicacao')) {
      form.setValue('storeInvite', [value]);
    }

    await form.trigger('storeInvite');
  };
  const CheckBox = ({ name, label }: { name: string; label: string }) => (
    <Checkbox
      my={4}
      value={name}
      isChecked={form.getValues().storeInvite.includes(name)}
      onChange={() => handleChange(name)}
      colorScheme="blue">
      {label}
    </Checkbox>
  );
  const { stores } = useStores();
  const { user, setUser } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { values } = useProfileForm();
  const onSubmit = async () => {
    const formValues = form.getValues();
    const phone = values.address?.mobile || user?.profile?.mobilePhone || user?.profile?.mobile;
    const birthdate = values.address?.birthdate
      ? moment(values.address?.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : user?.profile?.birthdate;

    const formData = {
      name: user?.profile?.given_name,
      lastName: (user?.profile as any)?.lastName || user?.profile?.family_name,
      email: user?.profile?.email,
      cpf: user?.profile?.cpf,
      phone: phone ? phone.replace(/\D/g, '') : '',
      birthdate,
      address: values.address,
      profession: values?.business?.profession,

      company: values?.business?.company,
      companyCNPJ: values?.business?.companyCNPJ,
      storeInvite:
        formValues.storeInvite.length > 1
          ? formValues.storeInvite.filter((i: string) => i !== 'indicacao')[0]
          : formValues.storeInvite[0],
      storeCNPJ: formValues.storeCNPJ,
      friendNameInvite: formValues.friendNameInvite,
      friendEmailInvite: formValues.friendEmailInvite,
      crea: values?.business?.crea,
      cau: values?.business?.cau,
      adb: values?.business?.adb,
    };
    try {
      showLoading();
      await UserService.updateProfile(formData);

      const newUserData = {
        ...user,
        profile: {
          ...user?.profile,
          ...values?.address,
          shouldCompleteAccountBeforeRedeem: false,
          shouldCompleteAccountBeforeCheckin: false,
        },
      };

      setUser(newUserData);
      await SecureStore.setItemAsync('user', JSON.stringify(newUserData));
      router.replace(RoutesEnum.HOME);
      hideLoading();
    } catch (err) {
      const error = err as TError;
      Alert.alert(
        'Alerta',
        error?.response?.data?.errors?.[0]?.message || 'Não foi possível atualizar o seu perfil.',
        [{ text: 'Ok' }],
        {
          cancelable: false,
        },
      );
    }
    hideLoading();
  };
  const keyboardVerticalOffset = Keyboard.isVisible() ? 80 : 0;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <AppBar>Onde nos conheceu?</AppBar>
      <FormProvider {...form}>
        <S.Container
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: form.getValues().storeInvite.includes('conviteLoja') ? 48 : 0,
          }}>
          <CheckBox label="Site" name="site" />
          <CheckBox label="Redes sociais" name="redesSociais" />
          <CheckBox label="Google" name="google" />
          <CheckBox label="Convite loja" name="conviteLoja" />
          <CheckBox label="Indicação" name="indicacao" />

          {form.getValues().storeInvite.includes('indicacao') && (
            <S.Form>
              <Text fontSize={18} color="blue.950" fontWeight={600}>
                Quem indicou nosso aplicativo para você?
              </Text>
              <Input
                name="friendNameInvite"
                placeholder="Informe o nome"
                label="Nome de quem indicou*"
              />
              <Input
                name="friendEmailInvite"
                placeholder="Informe o e-mail"
                label="E-mail de quem indicou *"
              />
            </S.Form>
          )}

          {form.getValues().storeInvite.includes('conviteLoja') && (
            <S.Box>
              <Select
                placeholder="Selecione a loja"
                name="storeCNPJ"
                options={stores ? stores.map((i) => ({ label: i.name, value: i.cnpj })) : []}
              />
            </S.Box>
          )}

          <S.BottomContainer>
            <Button
              variant="outline"
              onPress={router.back}
              width="100%"
              mt={8}
              textAlign="center"
              borderColor="blue.500"
              _text={{ color: 'blue.500' }}>
              Voltar
            </Button>
            <Button
              bgColor={!form.formState.isValid ? 'gray.200' : 'blue.500'}
              width="100%"
              disabled={!form.formState.isValid}
              textAlign="center"
              onPress={onSubmit}>
              Finalizar
            </Button>
          </S.BottomContainer>
        </S.Container>
      </FormProvider>
    </KeyboardAvoidingView>
  );
};
