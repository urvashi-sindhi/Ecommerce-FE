import {
  DASHBOARD_HIGHEST_PURCHASE,
  DASHBOARD_PIE_CHART,
  DASHBOARD_STATISTIC,
} from "./ApiRoutes";
import { authData } from "./AuthApi";

export const getDashboardStats = async () => {
  const response = await authData.get(DASHBOARD_STATISTIC);
  return response?.data;
};

export const getHighestPurchaseOrder = async () => {
  const response = await authData.get(DASHBOARD_HIGHEST_PURCHASE);
  return response?.data;
};

export const getPieChartData = async (data) => {
  const response = await authData.post(DASHBOARD_PIE_CHART, data);
  return response?.data;
};
