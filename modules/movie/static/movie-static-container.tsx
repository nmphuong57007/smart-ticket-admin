"use client";

import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useMovieStatic } from "@/api/hooks/use-movie-static";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import Charts from "./charts";

export default function MovieStaticContainer() {
  const { data: movieStaticData, isError, isLoading } = useMovieStatic();

  if (isError) toast.error("Lỗi tải thống kê phim");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.movies}>
            <ArrowLeft />
            Danh sách phim
          </Link>
        </Button>
      }
    >
      {movieStaticData && (
        <Charts
          movieStaticData={movieStaticData.data}
          isLoading={isLoading}
      />    )}
    </CardWrapperTable>
  );
}
