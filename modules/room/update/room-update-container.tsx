"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import RoomUpdateForm from "./room-update";


export default function RoomUpdateContainer({ id }: { id: string }) {
//   console.log("ID nhận vào:", id);

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.rooms}>
            <ArrowLeft />
            Danh sách phòng chiếu
          </Link>
        </Button>
      }
    >
     <RoomUpdateForm id={Number(id)} />
    </CardWrapperTable>
  );
}
