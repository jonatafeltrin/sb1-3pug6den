import { MaterialIcons } from '@expo/vector-icons';
import { Select as NSelect } from 'native-base';
import { Control, Controller, useFormContext } from 'react-hook-form';
type Props = {
  placeholder?: string;
  options: Option[];
  name: string;
};
export const Select = ({ options, placeholder, name }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control as Control}
      name={name}
      render={({ field }) => (
        <NSelect
          placeholder={placeholder}
          dropdownIcon={<MaterialIcons name="keyboard-arrow-down" size={24} color="black" />}
          onValueChange={field.onChange}
          borderColor="transparent"
          borderBottomColor="blue.900"
          style={{ paddingLeft: 0 }}
          paddingBottom="15px"
          _selectedItem={{
            bg: 'blue.900',
          }}>
          {options.map((option) => (
            <NSelect.Item label={option.label} value={option.value} key={option.value} />
          ))}
        </NSelect>
      )}
    />
  );
};
