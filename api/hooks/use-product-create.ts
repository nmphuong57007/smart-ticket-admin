import { useMutation, mutationOptions } from "@tanstack/react-query";

import { createProduct } from "../services/product-api";
import { ProductCreatResInterface } from "../interfaces/product-interface";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: ProductCreatResInterface) => {
      return createProduct(data);
    },
    ...mutationOptions,
  });
};
