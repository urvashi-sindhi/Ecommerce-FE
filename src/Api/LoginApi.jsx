import { LOGIN } from "./ApiRoutes";
import { authData } from "./AuthApi";

export const login = async (data) => {
  const response = await authData.post(LOGIN, data);
  return response?.data;
};
