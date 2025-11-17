import instance from "@/lib/instance";
import { RoomResInterface } from "../interfaces/room-interface";

export const getRoom = async (
  per_page?: number,
  page?: number,
  sort_order?: string,
  sort_by?:string,
  search?:string
): Promise<RoomResInterface> => {
  try {
    const res = await instance.get<RoomResInterface>(`/api/rooms`, {
      params: {
        per_page,
        page,
        sort_order: sort_order ?? "asc",
        sort_by,
        search
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};