"use client";

import { toast } from "sonner";
import Link from "next/link";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { GenreTable } from "./genre-table";
import { Fragment } from "react";
import { useRenge } from "@/api/hooks/use-genre";


export  function GenreContainer() {


  const { data: genres, isError, isLoading } = useRenge();

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách phòng chiếu.");


  return (
    <CardWrapperTable
      title="Quản lý Thể loại"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createGenre}>Thêm mới thể loại</Link>
          </Button>
        </Fragment>
      }
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        genres && (
          <GenreTable
            data={genres.data}
          />
        )
      )}
    </CardWrapperTable>
  );
}
