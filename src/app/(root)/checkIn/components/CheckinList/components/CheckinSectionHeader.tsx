import { Text } from 'react-native';
import { CheckinSectionComponentProps } from '../CheckinList.types';

export default function CheckinSectionHeader({ section }: CheckinSectionComponentProps) {
  return <Text style={{ color: '#393939', fontSize: 16, marginTop: 16 }}>{section.title}</Text>;
}
