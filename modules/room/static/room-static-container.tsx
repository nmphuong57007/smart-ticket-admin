"use client";

import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import Charts from "./charts";
import { useRoomStatic } from "@/api/hooks/use-room-static";

export default function RoomStaticContainer() {
  const { data: roomStaticData, isError, isLoading } = useRoomStatic();

  if (isError) toast.error("Lỗi tải thống kê phòng chiếu");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.rooms}>
            <ArrowLeft />
            Thống kê phòng chiếu
          </Link>
        </Button>
      }
    >
      {roomStaticData && (
        <Charts
          roomStaticData={roomStaticData.data}
          isLoading={isLoading}
      />    )}
    </CardWrapperTable>
  );
}
