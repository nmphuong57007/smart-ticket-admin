"use client";

import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";

import Charts from "./charts";
import { useShowtimeStatisticsAll } from "@/api/hooks/use-showtime-static";

export default function ShowTimeStaticContainer() {
  const { data, isError, isLoading } = useShowtimeStatisticsAll();

  if (isError) toast.error("Lỗi tải thống kê suất chiếu");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.showtimes}>
            <ArrowLeft />
            Danh sách suất chiếu
          </Link>
        </Button>
      }
    >
      {/* Nếu data có → render Charts */}
      {data && <Charts isLoading={isLoading} />}
    </CardWrapperTable>
  );
}
