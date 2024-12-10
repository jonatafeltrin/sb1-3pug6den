import { IExtractContentResponse, IGetExtractResumeDto, IToExpirePoints } from '@/types/Extract';
import { IStore } from '@/types/Store';

export type DetailModalProps = {
  itemToShowDetails?: IExtractContentResponse;
  setItemToShowDetails: React.Dispatch<IExtractContentResponse | undefined>;
  stores: IStore[];
  resume: IGetExtractResumeDto | undefined;
  toExpirePoints: IToExpirePoints[] | undefined;
};
