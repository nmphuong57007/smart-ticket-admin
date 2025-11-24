"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRooms } from "@/api/hooks/use-room";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { RoomTable } from "./room-table";
import Search from "@/components/search";


const per_page = 10;
export  function RoomContainer() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");


  const { data: rooms, isError, isLoading } = useRooms(
    per_page, 
    page, 
    "desc",
    "id",
    search
  );

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách phòng chiếu.");

  const lastPage = rooms?.data.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý Phòng chiếu"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createRoom}>Thêm mới phòng chiếu</Link>
          </Button>
          <Button variant="secondary">
            <Link href={redirectConfig.roomStatic}>Thống kê phòng chiếu</Link>
          </Button>
        </Fragment>
      }
    >
      <Search
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              onSearch={(v) => {
                setSearch(v);
                setPage(1);
              }}
              loading={isLoading}
            />
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        rooms && (
          <RoomTable
            data={rooms.data.items}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
