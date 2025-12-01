import { useMutation, } from "@tanstack/react-query";
import { updateBanner } from "../services/banner-api";


export const useUpdateBanner = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return updateBanner(id, data);
    },
  });
};