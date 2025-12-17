import instance from "@/lib/instance";
import { DashboardResponse } from "../interfaces/dashboard-interface";

export const getDashboardStatistics = async (
  range: "today" | "7d" | "30d"
): Promise<DashboardResponse> => {
  const res = await instance.get<DashboardResponse>("/api/dashboard", {
    params: { range },
  });

  return res.data;
};
