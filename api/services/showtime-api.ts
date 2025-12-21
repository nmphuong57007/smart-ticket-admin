import instance from "@/lib/instance";
import { 
    ShowTimeResInterface ,
    ShowTimeCreateReqInterface,
    ShowTimeCreatePayload,
    ShowTimeDetailResInterface,
    ShowTimeUpdateResInterface,
    ShowTimeDeleteResInterface,
    ShowtimeStatisticsAll,
    ShowtimeStatisticsByDate
} from "../interfaces/showtimes-interface";

export const getShowtimes = async (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?: string,
  room_id?: number
): Promise<ShowTimeResInterface> => {
  try {
    const res = await instance.get<ShowTimeResInterface>(`/api/showtimes`, {
      params: {
      per_page,
      page,
      sort_by,
      sort_order,
      room_id,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getShowTimeDetail = async (
  showtime_id: number
): Promise<ShowTimeDetailResInterface> => {
  try {
    const res = await instance.get<ShowTimeDetailResInterface>(
      `/api/showtimes/${showtime_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createShowTime = async (data: ShowTimeCreatePayload) => {
  try {
    const res = await instance.post<ShowTimeCreateReqInterface>(
      `/api/showtimes`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};


export const updateShowTime = async (
  showtime_id: number,
  data: FormData
): Promise<ShowTimeUpdateResInterface> => {
  try {
    const res = await instance.post<ShowTimeUpdateResInterface>(
      `/api/showtimes/${showtime_id}?_method=PUT`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteShowTime = async (showtimeId: number): Promise<ShowTimeDeleteResInterface> => {
  const res = await instance.delete<ShowTimeDeleteResInterface>(`/api/showtimes/${showtimeId}`);
  return res.data;
};

export const getShowtimeStatisticsAll = async (): Promise<ShowtimeStatisticsAll> => {
  const res = await instance.get("/api/showtimes/statistics");
  return res.data.data; 
};

export const getShowtimeStatisticsByDate = async (
  date: string
): Promise<ShowtimeStatisticsByDate> => {
  const res = await instance.get("/api/showtimes/statistics/by-date", {
    params: { date },
  });
  return res.data.data;
};