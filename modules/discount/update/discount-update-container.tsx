"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import DiscountUpdateForm from "./discount-update";


export default function DiscountUpdateContainer({ id }: { id: string }) {
//   console.log("ID nhận vào:", id);

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.discounts}>
            <ArrowLeft />
            Danh sách mã giảm giá
          </Link>
        </Button>
      }
    >
     <DiscountUpdateForm id={Number(id)} />
    </CardWrapperTable>
  );
}
