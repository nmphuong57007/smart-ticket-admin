"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard-api";
import { DashboardResponse } from "../interfaces/dashboard-interface";

export const useDashboardStatistics = (range = "7d") => {
  const [data, setData] = useState<DashboardResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboard(range)
      .then((res) => setData(res.data))
      .finally(() => setIsLoading(false));
  }, [range]);

  return { data, isLoading };
};