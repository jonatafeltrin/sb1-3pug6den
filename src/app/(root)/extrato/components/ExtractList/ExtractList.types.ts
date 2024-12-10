import { IExtractContentResponse, IGetExtractResumeDto, IToExpirePoints } from '@/types/Extract';

export type ExtractListProps = {
  isLoading: boolean;
  statements: IExtractContentResponse[];
  tab?: number;
  onShowItemDetail: (item: IExtractContentResponse) => void;
  resume: IGetExtractResumeDto | undefined;
  toExpirePoints: IToExpirePoints[] | undefined;
};
