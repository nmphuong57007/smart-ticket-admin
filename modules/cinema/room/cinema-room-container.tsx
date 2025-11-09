"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import CinemaRoom from "./cinema-room";
import { Fragment } from "react";
import { useCinemaRooms } from "@/api/hooks/use-cinema-room";
import { toast } from "sonner";

interface CinemaRoomContainer {
  id: string;
}

export default function CinemaRoomContainer({ id }: CinemaRoomContainer) {
  const { data: cinemaRooms, isLoading, isError } = useCinemaRooms(Number(id));

  if (isError) toast.error("Lỗi tải danh sách phòng của rạp");

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
          <Button asChild variant="secondary">
            <Link href={redirectConfig.cinemaStatic}>Thống kê rạp</Link>
          </Button>
        </Fragment>
      }
    >
      {cinemaRooms && (
        <CinemaRoom isLoading={isLoading} cinemaRooms={cinemaRooms.data} />
      )}
    </CardWrapperTable>
  );
}
