import { API_BFF } from './api';

import { ApiRoutesEnum } from '@/enums';

const submit = <T>(data: T) => API_BFF.put(ApiRoutesEnum.FORGOT_PASSWORD, data);
const reset = <T>(data: T) => API_BFF.put(ApiRoutesEnum.FORGOT_PASSWORD_RESET, data);
const accountOptions = <T>(username: T) =>
  API_BFF.post<{ shouldShowEmailOption: boolean; shouldShowPhoneOption: boolean }>(
    ApiRoutesEnum.ACCOUNT_OPTIONS,
    { username },
  );
export default {
  submit,
  reset,
  accountOptions,
};
