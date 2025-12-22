import instance from "@/lib/instance";
import { ApproveReviewResInterface, ReviewDeleteResInterface, ReviewResInterface } from "../interfaces/review-interface";

export const getReviews = async (): Promise<ReviewResInterface> => {
  try {
    const res = await instance.get("/api/reviews/admin");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteReview = async (reviewId: number): Promise<ReviewDeleteResInterface> => {
  const res = await instance.delete<ReviewDeleteResInterface>(`/api/reviews/admin/${reviewId}`);
  return res.data;
};

export const approveReview = async (id: number): Promise<ApproveReviewResInterface> => {
  const res = await instance.put(`/api/reviews/admin/${id}/approve`);
  return res.data; // TRẢ VỀ data
};

export const rejectReview = async (id: number): Promise<ApproveReviewResInterface> => {
  const res = await instance.put(`/api/reviews/admin/${id}/reject`);
  return res.data; // TRẢ VỀ data
};