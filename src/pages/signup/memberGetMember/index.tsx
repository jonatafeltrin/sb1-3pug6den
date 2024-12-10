import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { Button, Checkbox, Text } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';

import * as S from './styles';

import { AppBar, Input, Select } from '@/components';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { RoutesEnum } from '@/enums';
import useStores from '@/hooks/useStores';
import { LastFormSchema } from '@/schemas';

export const MemberGetMemberForm = () => {
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
  const { setValues } = useProfileForm();
  const onSubmit = async () => {
    const formValues = form.getValues();

    setValues((old: { profile: Record<string, string> }) => ({
      ...old,
      profile: {
        ...old.profile,
        ...formValues,
        storeInvite:
          formValues.storeInvite.length > 1
            ? formValues.storeInvite.filter((i: string) => i !== 'indicacao')[0]
            : formValues.storeInvite[0],
      },
    }));
    router.push(RoutesEnum.SIGNUP_PASSWORD);
  };
  return (
    <>
      <AppBar>Onde nos conheceu?</AppBar>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#fff' }}
        keyboardVerticalOffset={70}>
        <FormProvider {...form}>
          <S.Container
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 58,
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
              <>
                <Text fontSize={18} color="blue.950" fontWeight={600} marginBottom="16px">
                  Conte pra gente, qual é a loja?
                </Text>
                <Select
                  placeholder="Selecione a loja"
                  name="storeCNPJ"
                  options={stores ? stores.map((i) => ({ label: i.name, value: i.cnpj })) : []}
                />
              </>
            )}
          </S.Container>
        </FormProvider>
        <S.BottomContainer>
          <Button
            bgColor={!form.formState.isValid ? 'gray.200' : 'blue.500'}
            width="100%"
            disabled={!form.formState.isValid}
            textAlign="center"
            onPress={onSubmit}>
            Próximo
          </Button>
        </S.BottomContainer>
      </KeyboardAvoidingView>
    </>
  );
};
