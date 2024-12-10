import { IExtractContentResponse, IGetExtractResumeDto, IToExpirePoints } from '@/types/Extract';
import { IStore } from '@/types/Store';

export type ExtractStatementsProps = {
  extractTotalPoints: number | undefined;
  stores: IStore[];
  email: string;
  isLoading: boolean;
  data?: IExtractContentResponse[];
  typeFilter?: string;
  onChangeTypeFilter: (filter?: string) => void;
  startDateFilter: string | undefined;
  endDateFilter: string | undefined;
  onApplyStartDateFilter: (startDate?: string) => void;
  onApplyEndDateFilter: (endDate?: string) => void;
  resume: IGetExtractResumeDto | undefined;
  toExpirePoints: IToExpirePoints[] | undefined;
};
