"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CinemaTable } from "./cinema-table";
import { useCinema } from "@/api/hooks/use-cinema";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

const per_page = 10;
export default function CinemaContainer() {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useCinema(per_page, page);
  const lastPage = data?.data.pagination.last_page || 1;

  if (isError)
    return toast.error("Đã có lỗi xảy ra khi tải danh sách rạp chiếu phim.");

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <p>Danh Sách Rạp Chiếu Phim</p>

              <div className="flex items-center gap-3">
                <Button>Thêm Rạp Chiếu Phim</Button>
                <Button variant="secondary">Thống kê rạp</Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
