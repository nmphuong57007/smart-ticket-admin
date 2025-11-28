import { useMutation, mutationOptions } from "@tanstack/react-query";

import { DisconutCreateReqInterface } from "../interfaces/discount-interface";
import { createDiscount } from "../services/discount-api";

export const useCreateDiscount = () => {
  return useMutation({
    mutationFn: (data: DisconutCreateReqInterface) => {
      return createDiscount(data);
    },
    ...mutationOptions,
  });
};