"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import Search from "@/components/search";
import { BannerTable } from "./banner-table";
import { useBanners } from "@/api/hooks/use-banner";


const per_page = 10;
export  function BannerContainer() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");


  const { data: banners, isError, isLoading  } = useBanners(
    per_page, 
    page, 
    search
  );

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách banner.");

  const lastPage = banners?.data.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý Banner"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createBanner}>Thêm mới banner</Link>
          </Button>
        </Fragment>
      }
    >
      <Search
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              onSearch={(v) => {
                setSearch(v);
                setPage(1);
              }}
              loading={isLoading}
            />
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        banners && (
          <BannerTable
            data={banners.data.items}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
        
          />
        )
      )}
    </CardWrapperTable>
  );
}
