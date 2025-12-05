"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import ProductUpdateForm from "./product-update-form";

export default function ProductUpdateContainer() {
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.products}>
            <ArrowLeft />
            Sửa sản phẩm
          </Link>
        </Button>
      }
    >
      <ProductUpdateForm />
    </CardWrapperTable>
  );
}
