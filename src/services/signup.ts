import { API_BFF } from './api';

import { ApiRoutesEnum } from '@/enums';
const submit = <T>(data: T) => API_BFF.post(ApiRoutesEnum.SIGNUP, data);
const verify = <T>(data: T) => API_BFF.put(ApiRoutesEnum.SIGNUP_VERIFY, data);
const resendCode = <T>(email: T) => API_BFF.post(ApiRoutesEnum.RESEND_CODE, { email });

const getConsentOptions = () => API_BFF.get(ApiRoutesEnum.CONSENT_OPTIONS);

const services = {
  submit,
  verify,
  resendCode,
  getConsentOptions,
};
export default services;
