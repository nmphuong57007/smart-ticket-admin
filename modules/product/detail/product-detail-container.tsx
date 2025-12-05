"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useProductDetail } from "@/api/hooks/use-product-detail";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import ProductDetail from "./product-detail";
import { toast } from "sonner";
import { Fragment } from "react";

interface ProductDetailContainerProps {
  id: string;
}

export default function ProductDetailContainer({
  id,
}: ProductDetailContainerProps) {
  const { data: productDetail, isLoading, isError } = useProductDetail(Number(id));

  if (isError) return toast.error("Đã có lỗi xảy ra khi tải chi tiết sản phẩm.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.products}>
            <ArrowLeft />
            Danh Sách Sản Phẩm
          </Link>
        </Button>
      }

    >
      {productDetail && (
        <ProductDetail product={productDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
