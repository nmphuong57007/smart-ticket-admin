import instance from "@/lib/instance";
import { 
  DisconutCreateReqInterface, 
  DiscountDisableResInterface, 
  DiscountResInterface ,
  DiscountUpdateReqInterface,
  DiscountUpdateResInterface,
} from "../interfaces/discount-interface";

export const getDiscount = async (
  per_page?: number,
  page?: number,
): Promise<DiscountResInterface> => {
  try {
    const res = await instance.get<DiscountResInterface>(`/api/promotions`, {
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

export const createDiscount = async (data: DisconutCreateReqInterface) => {
  try {
    const res = await instance.post<DisconutCreateReqInterface>(
      `/api/promotions`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateDiscount = (id: number, data: DiscountUpdateReqInterface) => {
  return instance
    .patch<DiscountUpdateResInterface>(`/api/promotions/${id}`, data)
    .then((res) => res.data); // unwrap AxiosResponse
};



export const disableDiscount = async (id: number): Promise<DiscountDisableResInterface> => {
  const res = await instance.delete(`/api/promotions/${id}`);
  return res.data; // TRẢ VỀ data
};
