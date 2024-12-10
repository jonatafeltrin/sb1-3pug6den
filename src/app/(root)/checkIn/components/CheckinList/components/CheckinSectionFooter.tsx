import { Heading, Skeleton } from 'native-base';
import { CheckinSectionComponentProps } from '../CheckinList.types';
import { View } from 'react-native';

export default function CheckinSectionFooter({ section }: CheckinSectionComponentProps) {
  if (section.loadingState) {
    return <Skeleton.Text style={{ paddingVertical: 16 }} isLoaded={false} />;
  }

  return !section.data?.length ? (
    <View style={{ paddingVertical: 16 }}>
      <Heading size="xs" color="gray.500" textAlign="center">
        {section.emptyMessage}
      </Heading>
    </View>
  ) : null;
}
