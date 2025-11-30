"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import RoomUpdateForm from "./room-update";
import { useAuthRole } from "@/api/hooks/use-auth-role";
import { toast } from "sonner";


export default function RoomUpdateContainer({ id }: { id: string }) {
//   console.log("ID nhận vào:", id);
const { isError, isLoading } = useAuthRole();

  if (isLoading) return <p className="p-4">Đang kiểm tra quyền truy cập...</p>;

  if (isError) {
    return (
      toast.error("Bạn không có quyền truy cập"),

      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          ❌ Bạn không có quyền truy cập
        </div>
      </div>
    );
  }
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
