import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  EDIT_PRODUCT,
  LIST_OF_PRODUCTS,
  VIEW_PRODUCT,
} from "./ApiRoutes";
import { authData } from "./AuthApi";

export const listOfProduct = async (data) => {
  const response = await authData.post(LIST_OF_PRODUCTS, data);
  return response?.data;
};

export const addProduct = async (data) => {
  const response = await authData.post(ADD_PRODUCT, data);
  return response?.data;
};

export const editProduct = async (id, data) => {
  const response = await authData.put(`${EDIT_PRODUCT}${id}`, data);
  return response?.data;
};

export const deleteProduct = async (id) => {
  const response = await authData.delete(`${DELETE_PRODUCT}${id}`, id);
  return response?.data;
};

export const viewProduct = async (id) => {
  const response = await authData.get(`${VIEW_PRODUCT}${id}`);
  return response?.data;
};
