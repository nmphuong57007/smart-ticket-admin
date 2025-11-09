import instance from "@/lib/instance";
import {
  CinemaResInterface,
  CinemaDetailResInterface,
  CinemaStaticReqInterface,
  CinemaRoomReqInterface,
} from "../interfaces/cinema-interface";

export const getCinemas = async (
  per_page?: number,
  page?: number
): Promise<CinemaResInterface> => {
  try {
    const res = await instance.get<CinemaResInterface>(`/api/cinemas`, {
      params: {
        per_page,
        page,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCinemaDetail = async (
  cinema_id: number
): Promise<CinemaDetailResInterface> => {
  try {
    const res = await instance.get<CinemaDetailResInterface>(
      `/api/cinemas/${cinema_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCinemaStatic = async (): Promise<CinemaStaticReqInterface> => {
  try {
    const res = await instance.get<CinemaStaticReqInterface>(
      `/api/cinemas/statistics`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCinemaRooms = async (
  cinema_id: number
): Promise<CinemaRoomReqInterface> => {
  try {
    const res = await instance.get<CinemaRoomReqInterface>(
      `/api/cinemas/${cinema_id}/rooms`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
