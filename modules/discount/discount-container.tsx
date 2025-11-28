"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { DisconutTable } from "./discount-table";
import { useDiscounts } from "@/api/hooks/use-discount";


const per_page = 10;
export  function DiscountContainer() {
  const [page, setPage] = useState<number>(1);

  const { data: discounts, isError, isLoading } = useDiscounts(
    per_page, 
    page, 
  );

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách phòng chiếu.");

  const lastPage = discounts?.pagination.last_page || 1;

  return (
    <CardWrapperTable
      title="Quản lý Mã Giảm Giá"
      actions={
        <Fragment>
          <Button asChild>
            <Link href={redirectConfig.createDiscount}>Thêm mới mã giảm giá</Link>
          </Button>
        </Fragment>
      }
    >
      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        discounts && (
          <DisconutTable
            data={discounts.data}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )
      )}
    </CardWrapperTable>
  );
}
