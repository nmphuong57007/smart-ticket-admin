import { useMutation } from "@tanstack/react-query";
import {
  DiscountUpdateReqInterface,
  DiscountUpdateResInterface,
} from "../interfaces/discount-interface";
import { updateDiscount } from "../services/discount-api";

export const useUpdateDiscount = () => {
  return useMutation<
    DiscountUpdateResInterface,                      // success
    unknown,                                         // error
    { id: number; data: DiscountUpdateReqInterface } // payload
  >({
    mutationFn: ({ id, data }) => updateDiscount(id, data),
  });
};
