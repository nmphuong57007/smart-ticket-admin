"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { ProductTable } from "./product-table";
import { useProducts } from "@/api/hooks/use-product";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import Search from "@/components/search";


const per_page = 10;
export default function ProductContainer() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const { data: products, isError, isLoading } = useProducts(
    
    per_page, 
    page, 
    "id",
    "desc",
    search
  );

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách sản phẩm.");

  const lastPage = products?.data.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý sản phẩm"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createProduct}>Thêm mới sản phẩm</Link>
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
        products && (
          <ProductTable
            data={products.data.products}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
