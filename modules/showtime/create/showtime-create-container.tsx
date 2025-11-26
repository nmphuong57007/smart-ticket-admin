"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import ShowTimeCreateForm from "./showtime-create";

export default function ShowTimeCreateContainer() {
       
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.showtimes}>
            <ArrowLeft />
            Danh Sách Suất Chiếu
          </Link>
        </Button>
      }
    >
       <ShowTimeCreateForm/>
    </CardWrapperTable>
  );
}
