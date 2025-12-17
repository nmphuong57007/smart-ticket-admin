import instance from "@/lib/instance";
import { DashboardResponse } from "../interfaces/dashboard-interface";

export const getDashboard = async (range = "7d") => {
  const res = await instance.get<DashboardResponse>("/api/dashboard", {
    params: { range },
  });
  return res.data;
};
