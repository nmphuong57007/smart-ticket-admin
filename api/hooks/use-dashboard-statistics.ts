"use client";

import { useEffect, useMemo, useState } from "react";
import { getDashboardStatistics } from "../services/dashboard-api";
import {
  DashboardData,
  DashboardQuery,
} from "../interfaces/dashboard-interface";

interface UseDashboardStatisticsResult {
  data: DashboardData | null;
  isLoading: boolean;
}

const isValidDateRange = (
  from?: string,
  to?: string
): boolean => {
  if (!from || !to) return true;
  return new Date(from) <= new Date(to);
};

export const useDashboardStatistics = (
  params: DashboardQuery
): UseDashboardStatisticsResult => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const canFetch = useMemo(() => {
    return isValidDateRange(params.from_date, params.to_date);
  }, [params.from_date, params.to_date]);

  useEffect(() => {
    if (!canFetch) return;

    setIsLoading(true);

    getDashboardStatistics(params)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [canFetch, JSON.stringify(params)]);

  return { data, isLoading };
};
