"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import { toast } from "sonner";
import { Fragment } from "react";
import { useShowTimeDetail } from "@/api/hooks/use-showtime-detail";
import ShowTimeDetail from "./showtime-detail";

interface ShowTimeDetailContainerProps {
  id: string;
}

export default function ShowTimeDetailContainer({
  id,
}: ShowTimeDetailContainerProps) {
  const { data: showtimeDetail, isLoading, isError } = useShowTimeDetail(Number(id));

  if (isError) return toast.error("Đã có lỗi xảy ra khi tải chi tiết phim.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.showtimes}>
            <ArrowLeft />
            Danh Sách Suất Chiếu
          </Link>
        </Button>
      }
      actions={
        <Fragment>
        <Button>
          <Link href={redirectConfig.roomUpdate(id)}>Sửa phòng chiếu</Link>
        </Button>
        </Fragment>
      }
    >
      {showtimeDetail?.data && (
        <ShowTimeDetail showtime={showtimeDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
