"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useMovieDetail } from "@/api/hooks/use-movie-detail";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import MovieDetail from "./movie-detail";
import { toast } from "sonner";

interface MovieDetailContainerProps {
  id: string;
}

export default function MovieDetailContainer({
  id,
}: MovieDetailContainerProps) {
  const { data: movieDetail, isLoading, isError } = useMovieDetail(Number(id));

  if (isError) return toast.error("Đã có lỗi xảy ra khi tải chi tiết phim.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.movies}>
            <ArrowLeft />
            Danh Sách Phim
          </Link>
        </Button>
      }
    >
      {movieDetail && (
        <MovieDetail movie={movieDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
