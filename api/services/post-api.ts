import instance from "@/lib/instance";
import { 
    PostResInterface ,
    PostCreateReqInterface,
    PostUpdateResInterface,
    PostDeleteResInterface
} from "../interfaces/post-interface";


export const getNews = async (
  per_page?: number,
  page?: number,
  search?:string
): Promise<PostResInterface> => {
  try {
    const res = await instance.get<PostResInterface>(`/api/content-posts?type=news `, {
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
export const getPromotion = async (
  per_page?: number,
  page?: number,
  search?:string
): Promise<PostResInterface> => {
  try {
    const res = await instance.get<PostResInterface>(`/api/content-posts?type=promotion `, {
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

export const createPost = async (data: PostCreateReqInterface) => {
  try {
    const res = await instance.post<PostCreateReqInterface>(
      `/api/content-posts`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updatePost = async (
  post_id: number,
  data: FormData
): Promise<PostUpdateResInterface> => {
  try {
    const res = await instance.post<PostUpdateResInterface>(
      `/api/content-posts/${post_id}?_method=PUT`,
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

export const getPostDetail = async (id: number) => {
  const res = await instance.get(`/api/content-posts/${id}`);
  return res.data;
};

export const deletePost = async (postId: number): Promise<PostDeleteResInterface> => {
  const res = await instance.delete<PostDeleteResInterface>(`/api/content-posts/${postId}`);
  return res.data;
};

