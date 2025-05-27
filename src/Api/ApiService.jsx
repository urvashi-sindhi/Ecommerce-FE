import axios from "axios";

export const authServices = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
