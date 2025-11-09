"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { MovieTable } from "./movie-table";
import { useMovies } from "@/api/hooks/use-movie";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";

const per_page = 10;
export default function MovieContainer() {
  const [page, setPage] = useState<number>(1);

  const { data: movies, isError, isLoading } = useMovies(per_page, page, "desc");

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách phim.");

  const lastPage = movies?.data.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý Phim"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createMovie}>Thêm mới phim</Link>
          </Button>
          <Button variant="secondary">Thống kê phim</Button>
        </Fragment>
      }
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        movies && (
          <MovieTable
            data={movies.data.movies}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
