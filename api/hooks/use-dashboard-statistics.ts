"use client";

import { useEffect, useState } from "react";
import { getDashboardStatistics } from "../services/dashboard-api";
import { DashboardData, DashboardRange } from "../interfaces/dashboard-interface";

export const useDashboardStatistics = (range: DashboardRange) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    getDashboardStatistics(range)
      .then((res) => setData(res.data))
      .finally(() => setIsLoading(false));
  }, [range]);

  return { data, isLoading };
};
