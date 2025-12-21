"use client";

import { toast } from "sonner";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Spinner } from "@/components/ui/spinner";
import { ReviewTable } from "./review-table";
import { useReviews } from "@/api/hooks/use-review";


export  function ReviewContainer() {
  const { data: review, isError, isLoading } = useReviews();
  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách bình luận & đánh giá.");
  return (
    <CardWrapperTable
      title="Quản lý bình luận & đánh giá"
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        review && (
          <ReviewTable
            data={review.data}
          />
        )
      )}
    </CardWrapperTable>
  );
}
