"use client";

import { Button } from "@/components/ui/button";
import { CinemaTable } from "./cinema-table";
import { useCinema } from "@/api/hooks/use-cinema";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Fragment, useState } from "react";
import CardWrapperTable from "@/components/card-wrapper-table";
import Link from "next/link";
import { redirectConfig } from "@/helpers/redirect-config";

const per_page = 10;
export default function CinemaContainer() {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useCinema(per_page, page);
  const lastPage = data?.data.pagination.last_page || 1;

  if (isError)
    return toast.error("Đã có lỗi xảy ra khi tải danh sách rạp chiếu phim.");

  return (
    <CardWrapperTable
      title="Danh Sách Rạp Chiếu Phim"
      actions={
        <Fragment>
          <Button>Thêm Rạp Chiếu Phim</Button>
          <Button asChild variant="secondary">
            <Link href={redirectConfig.cinemaStatic}>Thống kê rạp</Link>
          </Button>
        </Fragment>
      }
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        data && (
          <CinemaTable
            data={data?.data.cinemas}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
