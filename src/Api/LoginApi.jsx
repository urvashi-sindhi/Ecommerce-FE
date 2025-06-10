import {
  FORGOT_PASSWORD,
  LIST_OF_CITY,
  LIST_OF_COUNTRY,
  LIST_OF_STATE,
  LOGIN,
  UPDATE_PROFILE,
  VERIFY_EMAIL,
  VIEW_PROFILE,
  FILE_UPLOAD,
} from "./ApiRoutes";
import { authData, fileUploadData } from "./AuthApi";

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

export const viewProfile = async () => {
  const response = await authData.get(VIEW_PROFILE);
  return response?.data;
};

export const listOfCountry = async () => {
  const response = await authData.get(LIST_OF_COUNTRY);
  return response?.data;
};

export const listOfState = async (id) => {
  const response = await authData.get(`${LIST_OF_STATE}${id}`);
  return response?.data;
};

export const listOfCity = async (id) => {
  const response = await authData.get(`${LIST_OF_CITY}${id}`, id);
  return response?.data;
};

export const updateProfile = async (data) => {
  const response = await authData.put(UPDATE_PROFILE, data);
  return response?.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("files", file);
  const response = await fileUploadData.post(FILE_UPLOAD, formData);
  return response?.data;
};
