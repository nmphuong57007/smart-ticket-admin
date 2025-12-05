import instance from "@/lib/instance";

import {
  ProductResInterface,
  ProductDetailResInterface,
  ProductCreatResInterface,
  ProductUpdateResInterface,
  ProductDeleteResInterface,
} from "../interfaces/product-interface";

export const getProducts = async (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?:string,
  search?: string
 
): Promise<ProductResInterface> => {
  try {
    const res = await instance.get<ProductResInterface>(`/api/products`, {
      params: {
        per_page,
        page,
        sort_by,
        sort_order,
        search,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getProductDetail = async (
  product_id: number
): Promise<ProductDetailResInterface> => {
  try {
    const res = await instance.get<ProductDetailResInterface>(
      `/api/products/${product_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createProduct = async (data: ProductCreatResInterface) => {
  try {
    const res = await instance.post<ProductDetailResInterface>(
      `/api/products`,
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

export const updateProduct = async (
  product_id: number,
  data: FormData
): Promise<ProductUpdateResInterface> => {
  try{
    const res = await instance.post<ProductUpdateResInterface>(
      `/api/products/${product_id}?_method=POST`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err){
    throw err;
  }
}


export const deleteProduct = async (productId: number): Promise<ProductDeleteResInterface> => {
  const res = await instance.delete<ProductDeleteResInterface>(`/api/products/${productId}`);
  return res.data;
};


