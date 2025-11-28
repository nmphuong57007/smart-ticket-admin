"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import DiscountCreateForm from "./discount-create";

export default function DiscountCreateContainer() {
    
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.discounts}>
            <ArrowLeft />
            Danh Sách Phòng Chiếu
          </Link>
        </Button>
      }
    >
       <DiscountCreateForm/>
    </CardWrapperTable>
  );
}
