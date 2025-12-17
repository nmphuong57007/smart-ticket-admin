"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import GenreUpdateForm from "./genre-update";


export default function GenreUpdateContainer({ id }: { id: string }) {
//   console.log("ID nhận vào:", id);

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.seats}>
            <ArrowLeft />
            Danh sách thể loại
          </Link>
        </Button>
      }
    >
     <GenreUpdateForm id={Number(id)} />
    </CardWrapperTable>
  );
}
