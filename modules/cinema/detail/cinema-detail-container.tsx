"use client";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import CinemaDetail from "./cinema-detail";
import { useCinemaDetail } from "@/api/hooks/use-cinema-detail";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Fragment } from "react";
import Link from "next/link";

interface CinemaDetailContainerProps {
  id: string;
}

export default function CinemaDetailContainer({
  id,
}: CinemaDetailContainerProps) {
  const {
    data: cinemaDetail,
    isError,
    isLoading,
  } = useCinemaDetail(Number(id));

  if (isError) toast.error("Đã có lỗi xảy ra khi tải chi tiết rạp chiếu phim.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.cinemas}>
            <ArrowLeft />
            Danh Sách Rạp Chiếu Phim
          </Link>
        </Button>
      }
      actions={
        <Fragment>
          <Button>Thêm Rạp Chiếu Phim</Button>
          <Button variant="secondary">Thống kê rạp</Button>
        </Fragment>
      }
    >
      {cinemaDetail && (
        <CinemaDetail cinemaDetail={cinemaDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
