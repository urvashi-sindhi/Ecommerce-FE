import {
  ADD_CATEGORIES,
  DELETE_CATEGORIES,
  EDIT_CATEGORIES,
  LIST_OF_CATEGORIES,
  VIEW_CATEGORIES,
} from "./ApiRoutes";
import { authData } from "./AuthApi";

export const listOfCategory = async (data) => {
  const response = await authData.post(LIST_OF_CATEGORIES, data);
  return response?.data;
};

export const addCategory = async (data) => {
  const response = await authData.post(ADD_CATEGORIES, data);
  return response?.data;
};

export const editCategory = async (id, data) => {
  const response = await authData.put(`${EDIT_CATEGORIES}${id}`, data);
  return response?.data;
};

export const viewCategory = async (id) => {
  const response = await authData.get(`${VIEW_CATEGORIES}${id}`, id);
  return response?.data;
};

export const deleteCategory = async (id) => {
  const response = await authData.delete(`${DELETE_CATEGORIES}${id}`, id);
  return response?.data;
};
