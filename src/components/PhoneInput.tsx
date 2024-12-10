import { useFormContext } from 'react-hook-form';

import { Input } from './Input';

export const PhoneInput = () => {
  const form = useFormContext();
  const onChange = (text: string) => {
    form.setValue('mobile', text.replace(/\D/g, '').replace(/^(\d{2})(\d{9})$/, '($1) $2'));
    form.trigger('mobile');
  };

  return (
    <Input
      name="mobile"
      placeholder="(00) 000000000"
      label="Telefone *"
      maxLength={14}
      keyboardType="numeric"
      onChangeText={onChange}
    />
  );
};
