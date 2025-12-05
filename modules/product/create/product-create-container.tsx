"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import ProductCreateForm from "./product-create-form";
import { useRenge } from "@/api/hooks/use-genre";

export default function ProductCreateContainer() {
  const { data: rengeData } = useRenge();

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
      {/* ❗ Sửa lỗi TẠI ĐÂY */}
      <ProductCreateForm />
    </CardWrapperTable>
  );
}
