import { FORGOT_PASSWORD, LOGIN, VERIFY_EMAIL } from "./ApiRoutes";
import { authData } from "./AuthApi";

export const login = async (data) => {
  const response = await authData.post(LOGIN, data);
  return response?.data;
};

export const verifyEmail = async (data) => {
  const response = await authData.post(VERIFY_EMAIL, data);
  return response?.data;
};

export const forgotPassword = async (data) => {
  const response = await authData.put(FORGOT_PASSWORD, data);
  return response?.data;
};
