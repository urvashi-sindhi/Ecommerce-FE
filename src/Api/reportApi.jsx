import { USERS_REPORT, ORDER_REPORT } from "./ApiRoutes";
import { authData } from "./AuthApi";

export const getUsersReport = async (payload) => {
  const response = await authData.post(USERS_REPORT, payload);
  return response?.data;
};

export const getOrderReport = async (payload) => {
  const response = await authData.post(ORDER_REPORT, payload);
  return response?.data;
};
