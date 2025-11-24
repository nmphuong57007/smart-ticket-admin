import instance from "@/lib/instance";
import { 
  RoomResInterface,
  RoomDetailResInterface,
  RoomCreateReqInterface,
  RoomDeleteResInterface,
  RoomUpdateResInterface,
  RoomStaticReqInterface
 } from "../interfaces/room-interface";

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

export const getRoomDetail = async (
  room_id: number
): Promise<RoomDetailResInterface> => {
  try {
    const res = await instance.get<RoomDetailResInterface>(
      `/api/rooms/${room_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createRoom = async (data: RoomCreateReqInterface) => {
  try {
    const res = await instance.post<RoomCreateReqInterface>(
      `/api/rooms`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateRoom = async (
  room_id: number,
  data: {
    name: string;
    status: string;
    total_seats: number;
    seat_map: {
      code: string;
      type: "normal" | "vip";
      status: "active" | "broken";
    }[][];
  }
): Promise<RoomUpdateResInterface> => {
  try {
    const res = await instance.put<RoomUpdateResInterface>(
      `/api/rooms/${room_id}?_method=PUT`,
      data
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};


export const deleteRoom = async (roomId: number): Promise<RoomDeleteResInterface> => {
  const res = await instance.delete<RoomDeleteResInterface>(`/api/rooms/${roomId}`);
  return res.data;
};

export const getRoomStatic  = async (): Promise<RoomStaticReqInterface> => {
  try {
    const res = await instance.get<RoomStaticReqInterface>(
      `/api/rooms/statistics`
    );
    return res.data;
  }catch (err) {
    throw err;
  }
  };