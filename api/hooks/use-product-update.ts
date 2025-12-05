import { useMutation, } from "@tanstack/react-query";

import { updateProduct } from "../services/product-api";


export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return updateProduct(id, data);
    },
  });
};
