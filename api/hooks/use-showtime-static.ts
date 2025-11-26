import { useQuery } from "@tanstack/react-query";
import { getShowtimeStatisticsAll,
    getShowtimeStatisticsByDate
 } from "../services/showtime-api";


export const useShowtimeStatisticsAll = () => {
  return useQuery({
    queryKey: ["showtime_statistics_all"],
    queryFn: getShowtimeStatisticsAll
  });
};

export const useShowtimeStatisticsByDate = (date: string) => {
  return useQuery({
    queryKey: ["showtime_statistics_by_date", date],
    queryFn: () => getShowtimeStatisticsByDate(date),
    enabled: !!date
  });
};
