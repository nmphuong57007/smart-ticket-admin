"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import { toast } from "sonner";
import { Fragment } from "react";
import { useRoomDetail } from "@/api/hooks/use-room-detail";
import RoomDetail from "./room-detail";

interface RoomDetailContainerProps {
  id: string;
}

export default function RoomDetailContainer({
  id,
}: RoomDetailContainerProps) {
  const { data: roomDetail, isLoading, isError } = useRoomDetail(Number(id));

  if (isError) return toast.error("Đã có lỗi xảy ra khi tải chi tiết phim.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.rooms}>
            <ArrowLeft />
            Danh Sách Phòng Chiếu
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
      {roomDetail?.data && (
        <RoomDetail room={roomDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
