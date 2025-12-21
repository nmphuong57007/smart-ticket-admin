"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { ShowTimeTable } from "./showtime-table";
import { useShowTimes } from "@/api/hooks/use-showtime";
import { useRooms } from "@/api/hooks/use-room";


const per_page = 10;
export  function ShowTimeContainer() {
  const [page, setPage] = useState<number>(1);
  const [roomId, setRoomId] = useState<number | null>(null);
  const { data: showtimes, isError, isLoading } = useShowTimes(
    per_page, 
    page, 
    "id",
    "desc",
    roomId || undefined,
  );
  const { data: roomsData } = useRooms();

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách phòng chiếu.");

  const lastPage = showtimes?.data.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý suất chiếu"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createShowTime}>Thêm mới suất chiếu</Link>
          </Button>
          <Button variant="secondary">
            <Link href={redirectConfig.showtimeStatic}>Thống kê suất chiếu</Link>
          </Button>
        </Fragment>
      }
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        showtimes && (
          <ShowTimeTable
            data={showtimes.data.items}
            rooms={roomsData?.data.items || []}
            roomId={roomId}
            setRoomId={setRoomId}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
