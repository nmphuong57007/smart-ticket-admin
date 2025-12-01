import { useMutation, mutationOptions } from "@tanstack/react-query";

import { createBanner } from "../services/banner-api";
import { BannerCreateReqInterface } from "../interfaces/banner-interface";
export const useCreateBanner = () => {
  return useMutation({
    mutationFn: (data: BannerCreateReqInterface) => {
      return createBanner(data);
    },
    ...mutationOptions,
  });
};
