import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;
export const baseURLForImage = import.meta.env.VITE_APP_BASEIMAGEURL;

export const createAxiosInstance = (baseURL) => {
  const Bearer = "Bearer";
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (config && config.headers) {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        config.headers["Authorization"] = `${Bearer} ${authToken}`;
      }
    }
    return config;
  });

  return instance;
};

export const createFileUploadInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
};

export const authData = createAxiosInstance(baseURL);
export const fileUploadData = createFileUploadInstance(baseURL);
