import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from './api';
const registerDevice = <T>(data: T) => API_BFF.put(ApiRoutesEnum.REGISTER_DEVICE, data);
const getProfile = <T>(data: T) => API_BFF.put(ApiRoutesEnum.PROFILE, data);
const updateProfile = <T>(data: T) => API_BFF.put(ApiRoutesEnum.COMPLETE_PROFILE, data);

const updateAccount = <T>(data: T) => API_BFF.put(ApiRoutesEnum.UPDATE_ACCOUNT, data);
const services = {
  registerDevice,
  getProfile,
  updateProfile,
  updateAccount,
};
export default services;
