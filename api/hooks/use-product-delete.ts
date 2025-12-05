import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProductDeleteResInterface } from "../interfaces/product-interface";
import { deleteProduct } from "../services/product-api";
import { toast } from "sonner";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductDeleteResInterface, AxiosError, number>({
    mutationFn: (productId) => deleteProduct(productId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },

    onError: () => {
      toast.error("Xóa sản phẩm thất bại");
    },
  });
};
