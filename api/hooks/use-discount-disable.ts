import { useMutation } from "@tanstack/react-query";
import { disableDiscount } from "../services/discount-api";
import { DiscountDisableResInterface } from "../interfaces/discount-interface";

export const useDisableDiscount = () => {
  return useMutation<DiscountDisableResInterface, unknown, number>({
    mutationFn: (id) => disableDiscount(id),
  });
};
