import instance from "@/lib/instance";
import { BannerResInterface,
   BannerUpdateResInterface,
   BannerCreateReqInterface,
   BannerDeleteResInterface
 } from "../interfaces/banner-interface";


export const getBanner = async (
  per_page?: number,
  page?: number,
  search?:string
): Promise<BannerResInterface> => {
  try {
    const res = await instance.get<BannerResInterface>(`/api/content-posts?type=banner `, {
      params: {
        per_page,
        page,
        search
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};


export const updateBanner = async (
  banner_id: number,
  data: FormData
): Promise<BannerUpdateResInterface> => {
  try {
    const res = await instance.post<BannerUpdateResInterface>(
      `/api/content-posts/${banner_id}?_method=PUT`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createBanner = async (data: BannerCreateReqInterface) => {
  try {
    const res = await instance.post<BannerCreateReqInterface>(
      `/api/content-posts`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteBanner = async (bannerId: number): Promise<BannerDeleteResInterface> => {
  const res = await instance.delete<BannerDeleteResInterface>(`/api/content-posts/${bannerId}`);
  return res.data;
};