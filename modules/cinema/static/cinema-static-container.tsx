"use client";

import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";

import { useCinemaStatic } from "@/api/hooks/use-cinema-static";
import Charts from "./charts";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";

export default function CinemaStaticContainer() {
  const { data: cinemaStaticData, isError, isLoading } = useCinemaStatic();

  if (isError) toast.error("Lỗi tải thống kê rạp chiếu phim");

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
      {cinemaStaticData && (
        <Charts
          cinemaStaticData={cinemaStaticData.data}
          isLoading={isLoading}
        />
      )}
    </CardWrapperTable>
  );
}
