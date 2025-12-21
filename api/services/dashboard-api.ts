import instance from "@/lib/instance";
import { DashboardData, DashboardQuery } from "../interfaces/dashboard-interface";

interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export const getDashboardStatistics = async (
  params: DashboardQuery
): Promise<DashboardData> => {
  const res = await instance.get<DashboardApiResponse>(
    "/api/dashboard",
    { params }
  );

  return res.data.data;
};
